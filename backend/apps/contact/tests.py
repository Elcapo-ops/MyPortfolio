import smtplib
from unittest.mock import patch

from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from apps.portfolio.models import Profile
from .models import ContactMessage


class ContactMessageSubmissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.profile = Profile.objects.create(
            name="Portfolio Owner",
            headline="Developer",
            bio="Bio",
            email="owner@example.com",
            github_url="https://github.com/example",
            linkedin_url="https://www.linkedin.com/in/example",
        )
        self.payload = {
            "name": "Visitor",
            "email": "visitor@example.com",
            "message": "Hello from the contact form.",
        }

    @override_settings(
        EMAIL_HOST="smtp.example.com",
        DEFAULT_FROM_EMAIL="portfolio@example.com",
        CONTACT_EMAIL="",
    )
    @patch("apps.contact.urls.EmailMessage.send", autospec=True, return_value=1)
    def test_sends_notification_to_editable_profile_email(self, send):
        response = self.client.post("/api/v1/contact/", self.payload, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data["email_sent"])
        send.assert_called_once()
        self.assertEqual(send.call_args.kwargs, {"fail_silently": False})
        email = send.call_args.args[0]
        self.assertEqual(email.subject, "Portfolio contact from Visitor")
        self.assertEqual(email.body, "Name: Visitor\nEmail: visitor@example.com\n\nHello from the contact form.")
        self.assertEqual(email.from_email, "portfolio@example.com")
        self.assertEqual(email.to, [self.profile.email])
        self.assertEqual(email.reply_to, ["visitor@example.com"])
        self.assertEqual(ContactMessage.objects.count(), 1)

    @override_settings(
        EMAIL_HOST="smtp.example.com",
        DEFAULT_FROM_EMAIL="portfolio@example.com",
        CONTACT_EMAIL="jhonjordan010@gmail.com",
    )
    @patch("apps.contact.urls.EmailMessage.send", autospec=True, return_value=1)
    def test_contact_email_setting_overrides_profile_recipient(self, send):
        response = self.client.post("/api/v1/contact/", self.payload, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data["email_sent"])
        self.assertEqual(send.call_args.args[0].to, ["jhonjordan010@gmail.com"])

    @override_settings(EMAIL_HOST="")
    @patch("apps.contact.urls.EmailMessage.send")
    def test_saves_message_and_reports_when_smtp_is_not_configured(self, send):
        response = self.client.post("/api/v1/contact/", self.payload, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertFalse(response.data["email_sent"])
        self.assertEqual(ContactMessage.objects.count(), 1)
        send.assert_not_called()

    @override_settings(EMAIL_HOST="smtp.example.com")
    @patch("apps.contact.urls.EmailMessage.send", side_effect=smtplib.SMTPException("Unavailable"))
    def test_saves_message_and_reports_email_delivery_failure(self, send):
        response = self.client.post("/api/v1/contact/", self.payload, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertFalse(response.data["email_sent"])
        self.assertIn("could not be delivered", response.data["detail"])
        self.assertEqual(ContactMessage.objects.count(), 1)
