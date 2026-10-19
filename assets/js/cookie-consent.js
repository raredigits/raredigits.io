function createCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }

    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie =
      encodeURIComponent(name) + "=" + encodeURIComponent(value) +
      expires +
      "; Path=/" +
      "; SameSite=Lax" +
      secure;
}

function readCookie(name) {
    const nameEQ = encodeURIComponent(name) + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length));
      }
    }
    return null;
}

document.addEventListener("DOMContentLoaded", function () {
    const cookieNotice = document.getElementById("cookie-notice");
    const acceptBtn = document.getElementById("cookie-notice-accept");
    if (!cookieNotice || !acceptBtn) return;

    // Hide via the library's .rd-is-hidden class: rare-styles v0.7.0 keeps a
    // body::after spacer reserved while a .cookie-notice is present and not
    // .rd-is-hidden, so an inline display:none would leave a gap at the
    // bottom of every page.
    if (readCookie("cookie-notice-dismissed") === "true") {
      cookieNotice.classList.add("rd-is-hidden");
    } else {
      cookieNotice.classList.remove("rd-is-hidden");
    }

    acceptBtn.addEventListener("click", function () {
      createCookie("cookie-notice-dismissed", "true", 31);
      cookieNotice.classList.add("rd-is-hidden");
    });
});