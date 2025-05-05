import { Resend } from 'resend';
import * as React from 'react';
import { InviteMember } from '@/components/emailTemplate/inviteMember';

const resend = new Resend(process.env.RESEND_API_KEY);

const emailTemplateMap = {
  invite: InviteMember,
  verifyEmail: InviteMember,
};

export const sendMail = async (props: {
  from: string;
  to: string[];
  subject: string;
  templateData: Record<string, string>;
  type: 'invite' | 'verifyEmail';
}) => {
  try {
    const { from, to, subject, templateData, type } = props;
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      react: emailTemplateMap[type]({ templateData }) as React.ReactElement,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
};
