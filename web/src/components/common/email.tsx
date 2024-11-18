interface IEmailLink {
  email?: string
}

export default function EmailLink({ email }: IEmailLink) {
  const subject = 'Horizon Express Travel & Tours Voucher';
  const body = '';

  return (
    <a className="text-xs" href={`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}>
      {email}
    </a>
  );
};

