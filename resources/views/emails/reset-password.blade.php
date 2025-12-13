<x-mail::message>
{{-- Custom Header with logo
<div style="text-align: center; margin-bottom: 30px;">
    <img src="{{ asset('images/logo.png') }}" alt="Commerce" style="height: 50px;">
</div>
--}}

# Reset Your Password

Hey {{ $name }}! 👋

We received a request to reset your password for your **Commerce** account.

<x-mail::button :url="$url" color="primary">
Reset My Password
</x-mail::button>

**This link expires in 60 minutes.**

---

### Didn't request this?

No worries! Just ignore this email and your password will remain unchanged.

Thanks,<br>
**The Commerce Team**

<div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
    © {{ date('Y') }} Commerce. All rights reserved.
</div>
</x-mail::message>