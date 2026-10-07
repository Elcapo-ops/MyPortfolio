import logging
import smtplib

from django.conf import settings
from django.core.mail import EmailMessage
from django.urls import path
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from apps.portfolio.models import Profile
from .serializers import ContactMessageSerializer

logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([AllowAny])
def create_message(request):
    serializer = ContactMessageSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    message = serializer.save()
    profile = Profile.objects.first()
    recipient_email = settings.CONTACT_EMAIL or (profile.email if profile else "")
    if not recipient_email:
        logger.warning("Contact message %s was saved, but no recipient email is configured.", message.pk)
        return Response(
            {"detail": "Message saved, but the portfolio contact email is not configured.", "email_sent": False},
            status=status.HTTP_201_CREATED,
        )

    if not settings.EMAIL_HOST:
        logger.warning("Contact message %s was saved, but SMTP is not configured.", message.pk)
        return Response(
            {"detail": "Message saved, but email delivery is not configured. Please contact me directly by email.", "email_sent": False},
            status=status.HTTP_201_CREATED,
        )

    subject = f"Portfolio contact from {message.name}"
    body = f"Name: {message.name}\nEmail: {message.email}\n\n{message.message}"
    try:
        email = EmailMessage(
            subject,
            body,
            settings.DEFAULT_FROM_EMAIL,
            to=[recipient_email],
            reply_to=[message.email],
        )
        sent = email.send(fail_silently=False)
    except (OSError, smtplib.SMTPException, ValueError):
        logger.exception("Could not send notification for contact message %s.", message.pk)
        sent = 0

    if not sent:
        return Response(
            {"detail": "Message saved, but its email notification could not be delivered. Please contact me directly by email.", "email_sent": False},
            status=status.HTTP_201_CREATED,
        )

    return Response(
        {"detail": "Message sent successfully.", "email_sent": True},
        status=status.HTTP_201_CREATED,
    )


urlpatterns=[path("",create_message,name="contact")]
