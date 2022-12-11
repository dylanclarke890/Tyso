UI.onPageReady(() => {
  UI.makeFormAJAX(document.getElementById("contact-form"), (data) => {
    if (data.success) Message.success("Submitted successfully!");
    else Message.error(data.errors ? data.errors.join(" ") : data);
  });
});
