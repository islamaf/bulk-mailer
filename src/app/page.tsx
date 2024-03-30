"use client";

import { useState } from "react";
import validator from "validator";
import FlashMessage from "./components/FlashMessage";
import axios from "axios";
import useSWR from "swr";

export default function Home() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    sendAs: "",
  });
  const [emails, setEmails] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [flashKey, setFlashKey] = useState(0);
  const [onSend, setOnSend] = useState(false);

  const { data, error, isLoading } = useSWR(
    onSend ? "/api/page" : null,
    (url) => fetcher(url, { userData, emails, message, subject }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // oknzsewhkcohetpd

  console.log(data);

  const addEmail = (val: string) => {
    if (emails.includes(val)) {
      setErr("Email exists already. Try another email.");
      setFlashKey((flashKey) => flashKey + 1);
    } else if (validator.isEmail(val)) {
      setEmails((prev) => [...prev, val]);
    } else {
      setErr("Invalid email. Try again.");
      setFlashKey((flashKey) => flashKey + 1);
    }
  };

  return (
    <main className="flex max-h-screen flex-col  justify-center p-24">
      {error ||
        (err && (
          <FlashMessage
            key={flashKey}
            action={"danger"}
            message={error ? error.error : err}
          />
        ))}
      {data && (
        <FlashMessage
          key={"data" + Math.random()}
          action={"success"}
          message={data.message}
        />
      )}
      <div>
        <h1 className="text-[#008DFF]">Bulk Mailer</h1>
      </div>
      <div className="grid gap-2 grid-cols-1 justify-between border-[#008DFF] p-2 border-2 rounded-md bg-[#008cff27]">
        <input
          className="text-[#000] p-4 border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          type="email"
          placeholder={"Email"}
          onChange={(e) =>
            setUserData((userData) => ({
              ...userData,
              email: e.target.value,
            }))
          }
        />
        <input
          className="p-4 border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          type="password"
          placeholder={"Password"}
          onChange={(e) =>
            setUserData((userData) => ({
              ...userData,
              password: e.target.value,
            }))
          }
        />
        <input
          className="p-4 border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          type="text"
          placeholder={"Send As (e.g: YOUR_NAME <YOUR_EMAIL>)"}
          onChange={(e) =>
            setUserData((userData) => ({
              ...userData,
              sendAs: e.target.value,
            }))
          }
        />
      </div>
      <div className="flex justify-center border-[#008DFF] p-2 border-2 rounded-md bg-[#008cff27] mt-2">
        <input
          className="w-full p-4 rounded-md border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
          type="text"
          placeholder={"Subject"}
          onChange={(e) => {
            setSubject(e.currentTarget.value);
          }}
        />
      </div>
      <div className="flex justify-center border-[#008DFF] p-2 border-2 rounded-md">
        <div className="bg-[#008cff27] p-4 rounded-lg mr-4">
          <input
            className="p-4 mb-4 rounded-md border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
            type="text"
            placeholder={"Add Recipient"}
            onKeyDown={(e) => {
              console.log(e.key);
              if (e.key === "Enter") {
                addEmail(e.currentTarget.value);
              }
            }}
          />
          <div className="grid gap-4">
            {emails.map((email: string, idx: number) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-[#000]">{email}</span>
                <button
                  className="text-[#000] border-0"
                  onClick={() =>
                    setEmails((emails) => emails.filter((e) => e !== email))
                  }
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#008cff27] p-4 rounded-lg">
          <textarea
            className="p-4 border-0 rounded-md max-w-screen-lg min-h-fit focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Email"
            onChange={(e) => setMessage(e.currentTarget.value)}
            required={true}
            cols={103}
            rows={10}
          />
        </div>
      </div>
      <div className="flex items-center justify-center py-2">
        <button
          className="py-4 px-6 border-0 font-semibold text-xl text-[#008DFF] rounded-md hover:bg-[#008DFF] hover:text-[#fff]"
          onClick={() => setOnSend(!onSend)}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </main>
  );
}

const fetcher = async (url: string, body: Object) => {
  try {
    const response = await axios.post(url, body);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};
