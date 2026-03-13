'use client'

import { useState } from 'react';
import { automatedPublicCommunication, type AutomatedPublicCommunicationOutput } from '@/ai/flows/automated-public-communication-flow';
import { communicationAIInput } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Share2 } from 'lucide-react';

export default function PublicCommunication() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AutomatedPublicCommunicationOutput | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await automatedPublicCommunication(communicationAIInput);
      setResult(response);
    } catch (error) {
      console.error("Error generating communication:", error);
      // You could show a toast notification here
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Live Media & Public Communication</CardTitle>
        <CardDescription>AI-generated briefings and one-click sharing.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Generate Update for N1 Crash
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
                <Share2 className="mr-2 h-4 w-4" />
                Share to Media
            </Button>
        </div>
        
        {loading && <div className="text-center p-8"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /> <p className="mt-2 text-muted-foreground">Generating communications...</p></div>}
        
        {result && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Public Update</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>{result.publicUpdate}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Press Release Summary</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>{result.pressReleaseSummary}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Social Media Post</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>{result.socialMediaPost}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
