import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';

type HeaderProps = {
  /** When true, the top promo / marquee bar is not rendered */
  hideAnnouncement?: boolean;
};

export default function Header({ hideAnnouncement = false }: HeaderProps) {
  return (
    <>
      {!hideAnnouncement && <AnnouncementBar />}
      <Navbar />
    </>
  );
}
