import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill/dist/quill.snow.css";
import { bucketId, projectId } from "../appwrite";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { BiImageAdd } from "react-icons/bi";

const CreatePost = () => {
  const navigate = useNavigate();
  const filePickerRef = useRef();
  const quillRef = useRef(null);

  const [file, setFile] = useState(null);
  const [imageFileForma, setImageFileForma] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [dataForm, setDataForm] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [imageFileFormaUploading, setImageFileFormaUploading] = useState(false);
  const [imageFileFormaUploadError, setImageFileFormaUploadError] =
    useState(null);
  const [imageFileFormaUploadProgress, setImageFileFormaUploadProgress] =
    useState(0);
  const [imageFileFormaUrl, setImageFileFormaUrl] = useState(null);

  useEffect(() => {
    if (imageFileForma) {
      console.log(imageFileForma);
      uploadImageFileForma();
    }
  }, [imageFileForma]);

  const uploadImageFileForma = async () => {
    try {
      const fileId = "unique()"; // Генерация уникального ID для файла

      // Создаем FormData для загрузки файла
      const formData = new FormData();
      formData.append("fileId", fileId);
      formData.append("file", imageFileForma);

      // Создаем XMLHttpRequest для загрузки с отслеживанием прогресса
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files`
      );
      xhr.setRequestHeader("x-appwrite-project", projectId); // Замените на ID вашего проекта

      xhr.upload.onprogress = (event) => {
        setImageFileFormaUploading(true);
        setImageFileFormaUploadError(null);
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          setImageFileFormaUploadProgress(percentage);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 201) {
          const response = JSON.parse(xhr.responseText);
          setImageFileFormaUploadProgress(null);
          const imageId = response.$id;
          const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${imageId}/view?project=${projectId}`;
          setImageFileFormaUrl(fileUrl);
          setImageFileFormaUploading(false);
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range ? range.index : 0, "image", fileUrl);
        } else if (xhr.status === 400) {
          setImageFileFormaUploadError(
            "Upload failed: image have more than 10mb"
          );
          setImageFileFormaUploadProgress(null);
          setImageFileFormaUrl(null);
          setImageFileFormaUploading(false);
        }
      };

      xhr.onerror = () => {
        console.error("Upload error:", xhr.statusText);
        setImageFileFormaUploading(false);
      };

      xhr.send(formData);
    } catch (error) {
      console.error("Error uploading file:", error);
      setImageFileFormaUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong!");
    }
  };

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
            setDataForm({ ...dataForm, image: fileUrl });
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
    <div className="p-3 w-[850px] mx-auto">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) => {
              setDataForm({ ...dataForm, title: e.target.value });
            }}
          />
          <Select
            onChange={(e) => {
              setDataForm({ ...dataForm, category: e.target.value });
            }}
          >
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
        {imageFileUploadError ||
          (imageFileFormaUploadError && (
            <Alert color="failure">
              {imageFileUploadError ?? imageFileFormaUploadError}
            </Alert>
          ))}
        {imageFileUrl && (
          <img
            src={imageFileUrl}
            alt="Uploaded"
            className="w-full h-72 object-cover"
          />
        )}
        <div className="flex flex-col">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFileForma(e.target.files[0])}
            ref={filePickerRef}
            hidden
          />
          {imageFileFormaUploadProgress ? (
            <div className="w-12 h-12 mb-3 ml-auto">
              <CircularProgressbar
                value={imageFileFormaUploadProgress}
                text={`${imageFileFormaUploadProgress || 0}%`}
              />
            </div>
          ) : (
            <BiImageAdd
              className="mb-3 text-3xl ml-auto"
              onClick={() => filePickerRef.current.click()}
            />
          )}
          <ReactQuill
            ref={quillRef}
            theme="snow"
            placeholder="Write somethink..."
            className="h-72 w-full mb-12"
            required
            onChange={(value) => {
              setDataForm({ ...dataForm, content: value });
            }}
          />
        </div>
        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
          disabled={imageFileFormaUploadProgress || imageFileUploadProgress}
        >
          Publish
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
