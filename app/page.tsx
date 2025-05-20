import CheckInvitationToken from './_components/checkInvitationToken';
import Footer from './_components/footer';
import Hero from './_components/heroshima';

export default async function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Footer />
      <CheckInvitationToken />
    </div>
  );
}
