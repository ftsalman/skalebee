// Created By Muhammed Sahad on 02/09/2026 for AFE-ESS-002 - Design Unauthorized page


import { Button } from "@turtle-ui/components";

export const NotFoundPage = () => (
  <div className="h-full overflow-auto panel-scrollbar flex items-center justify-center p-4">
    <div className="size-full flex flex-col items-center justify-center">
      <img src="/svgs/icon.svg" alt="" width="96" height="96" className="w-24" />

      <h1 className="mt-2.5 text-h4 text-center text-headings">
        404 - Page Not Found
      </h1>

      <p className="mt-1.5 mb-4 text-center text-gray-400">
        The page you are looking for could not be found.
      </p>

      <Button variant="tertiary">
        <p className="underline text-md ">Contact Admin</p>
      </Button>
    </div>
  </div>
);
