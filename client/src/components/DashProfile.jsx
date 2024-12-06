import { Alert, Button, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState("");
  const filePickerRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
    setImageFileUploadProgress(null);
    setImageFileUploadError("");
  }, [imageFile]);

  const uploadImage = async () => {
    try {
      const bucketId = "6751f8f50016d01eb3ad"; // ID вашего хранилища
      const fileId = "unique()"; // Генерация уникального ID для файла

      // Создаем FormData для загрузки файла
      const formData = new FormData();
      formData.append("fileId", fileId);
      formData.append("file", imageFile);

      // Создаем XMLHttpRequest для загрузки с отслеживанием прогресса
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files`
      );
      xhr.setRequestHeader("x-appwrite-project", "6751f02300346c4aaccb"); // Замените на ID вашего проекта

      xhr.upload.onprogress = (event) => {
        setImageFileUploadError(null);
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          setImageFileUploadProgress(percentage);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 201) {
          const response = JSON.parse(xhr.responseText);
          setImageFileUploadProgress(100);
        } else if (xhr.status === 400) {
          setImageFileUploadError("Upload failed: image have more than 10mb");
          setImageFileUploadProgress(null);
          setImageFile(null);
          setImageFileUrl(null);
        }
      };

      xhr.onerror = () => {
        console.error("Upload error:", xhr.statusText);
      };

      xhr.send(formData);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full mb-8"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="password" />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default DashProfile;
