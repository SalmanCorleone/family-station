import { Button } from '../ui/button';

interface IEmailTemplateProps {
  templateData: Record<string, string>;
}

export const InviteMember = ({ templateData }: IEmailTemplateProps) => (
  <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border">
    <h1 className="text-2xl font-bold">Welcome, {templateData.name}!</h1>
    <p className="text-sm">You have been invited to join the family station by {templateData.inviterName}.</p>
    <p className="text-sm">
      Please click the button below to accept the invitation and start collaborating with your colleagues.
    </p>
    <a href={templateData.link} className="text-blue-500 underline">
      <Button variant={'default'}>Accept Invitation</Button>
    </a>

    <p>Or copy and paste the link below into your browser:</p>
    <input type="text" value={templateData.link} readOnly className="bg-gray-100 p-2 rounded-md" />
  </div>
);

export default InviteMember;
