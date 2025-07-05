"""
Twilio SMS Service for Luminous Flow
Handles SMS sending functionality
"""
import os
from twilio.rest import Client
from typing import Dict, Any, Optional

def send_twilio_message(to_number: str, body: str, sender_name: Optional[str] = None) -> Dict[str, Any]:
    """
    Send SMS using Twilio service
    
    Args:
        to_number: Phone number to send to
        body: Message content
        sender_name: Optional sender name (used as alphanumeric sender ID)
        
    Returns:
        Dict with success status and message details
    """
    return send_sms(to_number, body, sender_name)

def send_sms(to_number: str, body: str, sender_name: Optional[str] = None) -> Dict[str, Any]:
    """
    Send SMS using Twilio service
    
    Args:
        to_number: Phone number to send to
        message: Message content
        sender_name: Optional sender name (used as alphanumeric sender ID)
        
    Returns:
        Dict with success status and message details
    """
    try:
        # Get Twilio credentials from environment
        account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        from_number = os.getenv('TWILIO_PHONE_NUMBER')
        
        if not all([account_sid, auth_token]):
            return {
                'success': False,
                'error': 'Twilio credentials not configured'
            }
        
        # Initialize Twilio client
        client = Client(account_sid, auth_token)
        
        # Determine sender - use custom sender name if provided, otherwise phone number
        if sender_name and len(sender_name) <= 11 and sender_name.isalnum():
            # Use alphanumeric sender ID (max 11 characters)
            sender = sender_name
            final_message = body
        elif from_number:
            # Use phone number as sender
            sender = from_number
            # Include sender name in message if provided
            final_message = f"From {sender_name}: {body}" if sender_name else body
        else:
            return {
                'success': False,
                'error': 'No sender configuration available (need TWILIO_PHONE_NUMBER or valid sender_name)'
            }
        
        # Send SMS
        message_obj = client.messages.create(
            body=final_message,
            from_=sender,
            to=to_number
        )
        
        return {
            'success': True,
            'sid': message_obj.sid,
            'status': message_obj.status,
            'message': 'SMS sent successfully'
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def validate_phone_number(phone: str) -> Dict[str, Any]:
    """
    Validate phone number format
    
    Args:
        phone: Phone number to validate
        
    Returns:
        Dict with validation status
    """
    # Basic phone validation
    cleaned = ''.join(filter(str.isdigit, phone))
    
    if len(cleaned) < 10:
        return {
            'valid': False,
            'error': 'Phone number too short'
        }
    
    if len(cleaned) > 15:
        return {
            'valid': False,
            'error': 'Phone number too long'
        }
    
    return {
        'valid': True,
        'cleaned': f"+{cleaned}" if not phone.startswith('+') else phone
    }
