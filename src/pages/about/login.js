import "./login.css";
// h3 tag (Continue товч) -ийг сонгож байна
const continueBtn = document.querySelector("h3");

// .ner class-тай div-ийг сонгож байна
const input = document.querySelector(".ner");

// .ner div-ийн дотор input field байгаа тул нэмэлтээр үүсгэх шаардлагагүй
// оронд нь зөвхөн input-ыг ашиглана
// (гэрэлтэл харуулахын тулд CSS-д үзэмжийг тохируулна)

// Continue товч дээр дарахад ажиллах функц
continueBtn.addEventListener("click", function () {
  // input-ийн утгыг авч байна
  const value = input.querySelector("input").value;

  // Хоосон байвал анхааруулга өгнө
  if (value === "") {
    alert("Email эсвэл username оруулна уу!");
    return; // Цааш үргэлжлэхгүй
  }

  // @ тэмдэг байхгүй бөгөөд 3 тэмдэгтээс богино бол буруу гэж үзнэ
  if (value === "erdenedelgeruranbayr95@gmail.com") {
    alert(value + " - бүртгэл амжилттай!");
    window.location.href = "home.html";
    return; // Цааш үргэлжлэхгүй
  } else {
    alert("Bruu gmail baina!");
  }

  // Дээрх шалгалтуудыг давсан бол амжилттай гэж үзнэ
});
