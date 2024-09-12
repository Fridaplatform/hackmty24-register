import { Button } from "@/components/ui/button";
import { Team } from "@/types/Team";
import { useRef } from "react";
import QRCode from "react-qr-code";
import { useLoaderData, useParams } from "react-router-dom";
import * as htmlToImage from "html-to-image";

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
    <div className="min-h-dvh flex flex-col items-center h-full">
      <p className="mt-4 text-lg font-bold">
        Registration confirmed. Good luck!!
      </p>

      <div className="flex flex-col items-center justify-center gap-6 mt-8">
        <p className="text-lg">{team.teamName}</p>
        <div ref={qrCodeRef} className="size-48 bg-white p-4 rounded-lg border">
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            // TODO: creo que aquí se tiene que poner el teamId pero junto con una URL.
            value={team.teamId}
            viewBox={`0 0 256 256`}
          />
        </div>
        <Button onClick={handleDownloadClick}>Download QR Code</Button>

        <div className="space-y-3">
          <p className="text-center text-lg">Team ID: </p>
          <p className="font-bold">{team.teamId}</p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationConfirmed;
