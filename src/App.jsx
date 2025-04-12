
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";

export default function ExerciseRecommender() {
  const [preference, setPreference] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [showPremium, setShowPremium] = useState(false);

  const searchExercises = async () => {
    setLoading(true);
    setResults([]);
    setSummaries([]);
    try {
      const response = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          `https://www.google.com/search?q=best+exercises+for+${encodeURIComponent(preference)}`
        )}`
      );
      const data = await response.json();
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, "text/html");

      const links = [];
      const anchorTags = doc.querySelectorAll("a");
      anchorTags.forEach((a) => {
        const href = a.getAttribute("href");
        if (href && href.includes("/url?q=") && !href.includes("google.com")) {
          const url = href.split("/url?q=")[1].split("&")[0];
          if (!url.includes("youtube.com")) links.push(url);
        }
      });

      const topLinks = links.slice(0, 5);
      setResults(topLinks);

      const fakeSummaries = topLinks.map(
        (link, i) => `Summary for resource ${i + 1}: A concise explanation of recommended exercises for ${preference}.`
      );
      setSummaries(fakeSummaries);
    } catch (error) {
      console.error("Error fetching exercise recommendations:", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Exercise Recommender</h1>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="e.g., fat loss, core strength"
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
        />
        <Button onClick={searchExercises} disabled={loading || !preference}>
          {loading ? <Loader className="animate-spin" /> : "Search"}
        </Button>
      </div>

      {results.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2">Top Resources:</h2>
            <ul className="list-disc pl-4 space-y-2">
              {results.map((link, index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {link}
                  </a>
                  <p className="text-sm text-gray-600">{summaries[index]}</p>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <h3 className="text-lg font-medium">Video Previews (YouTube)</h3>
              <p className="text-sm text-gray-500">Premium Feature - <button onClick={() => setShowPremium(true)} className="text-blue-600 underline">Subscribe to access</button></p>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium">Food & Supplement Recommendations</h3>
              <p className="text-sm text-gray-500">Premium Feature - <button onClick={() => setShowPremium(true)} className="text-blue-600 underline">Subscribe to access</button></p>
            </div>
          </CardContent>
        </Card>
      )}

      {showPremium && (
        <Card className="mt-4 bg-yellow-100">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold mb-2">Unlock Premium Features</h2>
            <p className="mb-2">Access personalized video previews, expert food & supplement plans, and more.</p>
            <Button className="bg-yellow-500 hover:bg-yellow-600">Subscribe Now</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
