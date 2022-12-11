UI.onPageReady(() => {
  const subjects = [
    "Custom Website Inquiry",
    "Private Class Inquiry",
    "Popup Class Inquiry",
    "I'm interested in becoming a TYSO VIP",
  ];

  const params = new URLSearchParams(window.location.search);
  const subjectId = parseInt(params.get("subjectId") ?? "A");

  if (!isNaN(subjectId)) {
    const subject = subjects[subjectId];
    const el = document.querySelector('input[name="subject"]');
    if (el) el.value = subject ?? "";
  }

  UI.makeFormAJAX(document.getElementById("contact-form"), (data) => {
    if (data.success) Message.success("Submitted successfully!");
    else Message.error(data.errors ? data.errors.join(" ") : data);
  });
});
