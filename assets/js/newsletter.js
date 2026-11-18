(function () {
  if (window.__rdNewsletter) return;
  window.__rdNewsletter = true;

  var MESSAGES = {
    sending: "Sending…",
    success: "Almost there — check your inbox and confirm the subscription.",
    error: "Something went wrong. Please try again or write to hi@raredigits.io."
  };

  function setStatus(el, state) {
    el.hidden = false;
    el.textContent = MESSAGES[state];
    el.dataset.state = state;
  }

  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (!form.matches || !form.matches("form[data-newsletter]")) return;
    e.preventDefault();

    var status = form.parentElement.querySelector(".newsletter-status");
    var button = form.querySelector("button");
    button.disabled = true;
    setStatus(status, "sending");

    fetch(form.action + (form.action.indexOf("?") === -1 ? "?" : "&") + "isAjax=1", {
      method: "POST",
      body: new FormData(form)
    })
      .then(function (res) { return res.ok ? res.json() : Promise.reject(res); })
      .then(function (data) {
        if (!data || !data.success) throw data;
        setStatus(status, "success");
        form.reset();
        if (window.gtag) window.gtag("event", "newsletter_subscribe");
      })
      .catch(function () { setStatus(status, "error"); })
      .finally(function () { button.disabled = false; });
  });
})();
