"use client";

import React from "react";

export default function Page() {
  // A small inline helper to draw an arrow depending on screen size
  const HorizontalArrow = () => (
    <svg
      className="hidden md:block w-6 h-6 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );

  const VerticalArrow = () => (
    <svg
      className="block md:hidden w-6 h-6 text-gray-400 mx-auto"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 9l7 7 7-7" />
    </svg>
  );

  // inline renderer for each flow
  const renderFlow = (title: string, steps: string[]) => (
    <div className="p-6 bg-gray-50 rounded-xl mb-10 ">
      <h2 className="text-xl font-bold mb-6 text-center">{title}</h2>
      <div className="flex flex-col md:flex-row md:items-center md:justify-center">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="bg-white rounded-xl shadow p-4 flex-1 mx-0 md:mx-2 mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs">
                  {idx + 1}
                </span>
                <p className="text-sm">{step}</p>
              </div>
            </div>
            {idx !== steps.length - 1 && (
              <>
                <HorizontalArrow />
                <VerticalArrow />
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <main className="max-w-6xl mx-auto py-28">
      {renderFlow("Method 1: Gmail + BCC", [
        "Admin opens sheet & copies emails",
        "Paste emails into BCC",
        "Same subject/body for all recipients",
        "Send email (no personalisation)",
      ])}

      {renderFlow("Method 2: Google Sheets + Mail Merge Add-On", [
        "Prepare Sheet with Name, Rating, etc.",
        "Draft email with {{placeholders}} in Gmail",
        "Mail Merge Add-on replaces placeholders per row",
        "Send via Gmail quota",
        "Mark rows as 'Sent'",
      ])}

      {renderFlow("Method 3: Google Apps Script", [
        "Connect Sheet to Apps Script",
        "Apply rules (rating < 6)",
        "Build body dynamically per row",
        "Send via Gmail API",
        "Mark row as 'Sent'",
      ])}

      {renderFlow("Method 4: Own Backend System", [
        "Upload CSV or Authorise Google Sheets API",
        "Backend imports freelancers into DB",
        "Admin defines threshold rules (rating <6, etc.)",
        "Admin writes template with {{Name}}, {{Rating}}",
        "Backend generates personalised messages",
        "Send via SMTP/Mailgun/Sendinblue",
        "Update DB/Sheet status as 'Sent'",
        "Display logs & dashboard (delivered, opened, bounced)",
      ])}
    </main>
  );
}
