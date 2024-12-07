import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill/dist/quill.snow.css";
import { bucketId, projectId } from "../appwrite";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0);
  const [imageFileUrl, setImageFileUrl] = useState(null);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageFileUploadError("No file selected");
        return;
      }
      if (!imageFileUrl) {
        const fileId = "unique()"; // Генерация уникального ID для файла

        // Создаем FormData для загрузки файла
        const formData = new FormData();
        formData.append("fileId", fileId);
        formData.append("file", file);

        // Создаем XMLHttpRequest для загрузки с отслеживанием прогресса
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files`
        );
        xhr.setRequestHeader("x-appwrite-project", projectId); // Замените на ID вашего проекта

        xhr.upload.onprogress = (event) => {
          setImageFileUploading(true);
          setImageFileUploadError(null);
          if (event.lengthComputable) {
            const percentage = Math.round((event.loaded / event.total) * 100);
            setImageFileUploadProgress(percentage);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 201) {
            const response = JSON.parse(xhr.responseText);
            setImageFileUploadProgress(null);
            const imageId = response.$id;
            const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${imageId}/view?project=${projectId}`;
            setImageFileUrl(fileUrl);
            setImageFileUploading(false);
          } else if (xhr.status === 400) {
            setImageFileUploadError("Upload failed: image have more than 10mb");
            setImageFileUploadProgress(null);
            setImageFileUrl(null);
            setImageFileUploading(false);
          }
        };

        xhr.onerror = () => {
          console.error("Upload error:", xhr.statusText);
          setImageFileUploading(false);
        };

        xhr.send(formData);
      } else {
        setImageFileUploadError("You have already uploaded an image");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setImageFileUploading(false);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
          />
          <Select>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            sizing="lg"
            onChange={(e) => setFile(e.target.files[0], setImageFileUrl(null))}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageFileUploadProgress}
          >
            {imageFileUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageFileUploadProgress}
                  text={`${imageFileUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        {imageFileUrl && (
          <img
            src={imageFileUrl}
            alt="Uploaded"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write somethink..."
          className="h-72 mb-12"
          required
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
