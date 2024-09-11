import { Button } from "@/components/ui/button";
import { Team } from "@/types/Team";
import { useRef } from "react";
import QRCode from "react-qr-code";
import { useLoaderData, useParams } from "react-router-dom";
import * as htmlToImage from 'html-to-image';

const RegistrationConfirmed = () => {
  const team = useLoaderData() as Team;

  const qrCodeRef = useRef<HTMLDivElement>(null);

  const handleDownloadClick = () => {
    if (qrCodeRef.current === null) {
      return;
    }

    htmlToImage
      .toPng(qrCodeRef.current)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${team.teamName}_qrcode.png`;
        link.click();
      })
      .catch((err) => {
        console.error("Error generating image", err);
      });
  };

  return (
    <div>
      <p>Registration confirmed. Good luck!!</p>

      <p>{team.teamName}</p>

      <div ref={qrCodeRef}>
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={team.teamId}
          viewBox={`0 0 256 256`}
        />
      </div>

      <p>This is your team id: {team.teamId}</p>

      <Button onClick={handleDownloadClick}>Download QR Code</Button>
    </div>
  );
};

export default RegistrationConfirmed;
