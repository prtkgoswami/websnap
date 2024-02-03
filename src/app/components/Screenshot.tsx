// components/Screenshot.js
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";

const Screenshot = () => {
  const [url, setUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const [screenshotDataUrl, setScreenshotDataUrl] = useState("");
  const [selectedMode, setMode] = useState("desktop");
  const [isLoading, setLoading] = useState(false);

  const captureScreenshot = async () => {
    setLoading(true);
    const encodedUrl = encodeURIComponent(url);
    try {
      const response = await fetch(
        `/api/screenshot/${encodedUrl}_${selectedMode}`
      );
      if (response.ok) {
        const screenshotBlob = await response.blob();
        const dataUrl = URL.createObjectURL(screenshotBlob);
        setScreenshotDataUrl(dataUrl);
        const parts = url.split("/")[2].split(".");
        setImageName(parts[0]);
      } else {
        console.error("Error capturing screenshot");
      }
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center w-full gap-y-10">
      <div className="flex flex-col justify-center mb-16 gap-y-3">
        <div className="text-6xl text-white font-light text-center">
          WebSnap
        </div>
        <div className="text-lg text-white font-extralight text-center">
          Get Snapshot of any Website
        </div>
      </div>
      <div className="flex flex-row w-full justify-center gap-x-5">
        <input
          type="text"
          placeholder="Enter a URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="text-zinc-800 w-1/3 p-2 rounded-md"
        />
        <button
          onClick={captureScreenshot}
          className="border border-solid rounded-md p-2 hover:border-teal-500 hover:text-teal-500 transition-colors duration-200"
        >
          Capture Screenshot
        </button>
      </div>

      <div
        className="flex flex-row w-full justify-center gap-x-5"
        onChange={(event) => setMode((event.target as HTMLInputElement).value)}
      >
        <input
          type="radio"
          value="desktop"
          name="size"
          checked={selectedMode === "desktop"}
        />{" "}
        Desktop
        <input
          type="radio"
          value="mobile"
          name="size"
          checked={selectedMode === "mobile"}
        />{" "}
        Mobile
      </div>

      <div
        id="screenshot-target"
        className={`${
          selectedMode === "desktop"
            ? "h-[414px] w-[736px]"
            : "h-[736px] w-[414px]"
        } flex items-center justify-center relative border-8 border-solid border-gray-400`}
      >
        {!isLoading && screenshotDataUrl && (
          <a
            href={screenshotDataUrl}
            target="_blank"
            download={`screenshot-${imageName}-${selectedMode}`}
          >
            <Image
              src={screenshotDataUrl}
              alt="Website Screenshot"
              fill
              className="object-contain"
            />
          </a>
        )}
        {isLoading && (
          <p className="text-4xl animate-pulse">Fetching Screenshot</p>
        )}
      </div>
      {screenshotDataUrl && (
        <div className="text-lg text-white/80">
          Click <u>Image</u> to Download
        </div>
      )}
    </div>
  );
};

export default Screenshot;
