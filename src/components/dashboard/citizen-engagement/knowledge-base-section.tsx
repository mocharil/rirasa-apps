import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, BookOpen, CheckCircle2, XCircle } from "lucide-react";

interface KnowledgeBaseState {
  title: string;
  content: string;
  topic_classification: string;
  keywords: string[]; // Changed `never[]` to `string[]`
  file: File | undefined;
}

const KnowledgeBaseSection = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newKnowledge, setNewKnowledge] = useState<KnowledgeBaseState>({
    title: "",
    content: "",
    topic_classification: "",
    keywords: [],
    file: undefined,
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Auto-hide notifications after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const resetForm = () => {
    setNewKnowledge({
      title: "",
      content: "",
      topic_classification: "",
      keywords: [],
      file: undefined,
    });
    setUploadedFile(null);
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmitKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("title", newKnowledge.title);
      formData.append("content", newKnowledge.content);
      formData.append("topic_classification", newKnowledge.topic_classification);
      formData.append("keywords", newKnowledge.keywords.join(", "));
      if (newKnowledge.file) {
        formData.append("file", newKnowledge.file);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/knowledge-base`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail || "Unexpected error occurred during submission."
        );
      }

      const data = await response.json();
      setSuccess(data.message || "Knowledge base entry added successfully.");
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB. Please upload a smaller file.");
        return;
      }

      setUploadedFile(file);
      setNewKnowledge((prev) => ({
        ...prev,
        file,
      }));
    }
  };

  const handleFileRemove = () => {
    setUploadedFile(null);
    setNewKnowledge((prev) => ({
      ...prev,
      file: undefined,
    }));
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-2xl">Knowledge Base Management</CardTitle>
            <CardDescription className="mt-2 text-base">
              Add knowledge to enhance the chatbot's capabilities. You can
              contribute either through text entries or by uploading documents.
              The chatbot will use this information to provide more accurate and
              contextual responses to citizen inquiries.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Notifications */}
        {success && (
          <div className="mb-4 flex items-center gap-4 rounded-lg bg-green-50 p-4 text-green-800 shadow-md">
            <CheckCircle2 className="h-6 w-6" />
            <p>{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-4 flex items-center gap-4 rounded-lg bg-red-50 p-4 text-red-800 shadow-md">
            <XCircle className="h-6 w-6" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmitKnowledge} className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                value={newKnowledge.title}
                onChange={(e) =>
                  setNewKnowledge((prev) => ({ ...prev, title: e.target.value }))
                }
                required
                placeholder="Enter a descriptive title for this knowledge entry"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Content <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={newKnowledge.content}
                onChange={(e) =>
                  setNewKnowledge((prev) => ({ ...prev, content: e.target.value }))
                }
                required
                placeholder="Write the detailed content of the knowledge base entry"
                className="min-h-[200px] resize-y"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Topic Classification <span className="text-red-500">*</span>
              </label>
              <Input
                value={newKnowledge.topic_classification}
                onChange={(e) =>
                  setNewKnowledge((prev) => ({
                    ...prev,
                    topic_classification: e.target.value,
                  }))
                }
                required
                placeholder="E.g., Public Services, Healthcare, Education"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Keywords</label>
              <Input
                value={newKnowledge.keywords.join(", ")}
                onChange={(e) =>
                  setNewKnowledge((prev) => ({
                    ...prev,
                    keywords: e.target.value.split(",").map((k) => k.trim()),
                  }))
                }
                placeholder="Enter keywords separated by commas"
              />
              <p className="text-sm text-gray-500">
                Help improve searchability by adding relevant keywords
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Supporting Document</label>
              <div className="mt-2">
                <div className="flex items-center justify-center w-full">
                  {!uploadedFile ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOCX, or TXT (MAX. 10MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.docx,.txt"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between w-full p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-700">{uploadedFile.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleFileRemove}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Adding Entry..." : "Add Knowledge Entry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default KnowledgeBaseSection;
