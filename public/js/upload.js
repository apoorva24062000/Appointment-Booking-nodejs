const cloudName = "dt0q2yb3i";

const uploadPreset = "nyrykxm4";

const myWidget = cloudinary.createUploadWidget(
  {
    cloudName: cloudName,

    uploadPreset: uploadPreset,
  },

  (error, result) => {
    if (!error && result && result.event === "success") {
      console.log("Done! Here is the image info: ", result.info);

      document
        .getElementById("uploadedimage")
        .setAttribute("src", result.info.secure_url);

      console.log(result.info.secure_url);

      window.sessionStorage.image = result.info.secure_url;

      handleImageDisplay(result.info.secure_url);
    }
  }
);

document.getElementById("upload_widget").addEventListener(
  "click",

  function () {
    myWidget.open();
  },

  false
);

function handleImageDisplay(imageUrl) {
  const image = document.getElementById("uploadedimage");

  const uploadButton = document.getElementById("upload_widget");

  if (imageUrl) {
    image.src = imageUrl;

    image.classList.remove("hidden-image");

    uploadButton.disabled = true;

    uploadButton.classList.add("inactive-button");
  } else {
    image.src = "";

    image.classList.add("hidden-image");
  }
}