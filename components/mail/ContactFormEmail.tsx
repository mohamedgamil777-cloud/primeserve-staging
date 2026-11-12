// components/emails/contact-form.tsx
import { contactUsformSchema } from "@/types/mail";
import * as React from "react";
import { z } from "zod";

type ContactFormEmailProps  = z.infer<typeof contactUsformSchema>


export default function ContactFormEmail({
  name,
  email,
  subject,
  category,
  message,
}: ContactFormEmailProps) {
  return (
    <div className="max-w-[600px] mx-auto font-sans text-gray-800 leading-relaxed">
      {/* Header */}
      <div className="bg-blue-600 text-white p-8 text-center rounded-t-lg">
        <h1 className="text-2xl font-semibold m-0">New Contact Form Submission</h1>
        <p className="opacity-90 mt-2 m-0">
          You've received a new message from your website contact form.
        </p>
      </div>

      {/* Content */}
      <div className="p-6 bg-gray-50">
        {/* Contact Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Details</h2>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="py-2 pr-4 font-medium text-gray-500 w-[120px]">Name:</td>
                <td className="py-2 text-gray-900">{name}</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-gray-500">Email:</td>
                <td className="py-2">
                  <a
                    href={`mailto:${email}`}
                    className="text-blue-600 no-underline font-medium hover:underline"
                  >
                    {email}
                  </a>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-gray-500">Subject:</td>
                <td className="py-2 text-gray-900">{subject}</td>
              </tr>
              {category && (
                <tr>
                  <td className="py-2 pr-4 font-medium text-gray-500">Category:</td>
                  <td className="py-2">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                      {category}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Message Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Message</h2>
          <div className="whitespace-pre-wrap p-3 bg-gray-100 rounded border-l-4 border-blue-600">
            {message}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm pt-4 border-t border-gray-200">
          <p className="my-2">
            This message was sent via your website contact form. Please respond within 24 hours.
          </p>
          {/* <p className="my-2">
            <a
              href="https://yourwebsite.com/admin/messages"
              className="text-blue-600 no-underline font-medium hover:underline"
            >
              View all messages
            </a>
          </p> */}
        </div>
      </div>
    </div>
  );
}