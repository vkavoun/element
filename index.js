var ids = [];
var items = [];
var selected = [];

function collectAll() {
  ids.forEach((item) => {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open(
      "GET",
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${item}`,
      false
    ); // false for synchronous request
    xmlHttp.send(null);

    items.push(JSON.parse(xmlHttp.responseText));
  });

  console.log(items);
}

function renderItem(item) {
  return `
    <div class="card">
      <h3><input type="checkbox" id="${item.objectID}"></input>${
    item.title
  }</h3>
      <p>
        <a href=${item.objectURL}>
          <img src=${
            item.primaryImage && item.primaryImage !== ""
              ? item.primaryImage
              : "no-image.png"
          } class="image"/>
        </a>
      </p>
      <p>
        <a href=${item.artistULAN_URL}>
          ${item.artistDisplayName}
        </a>
      </p>
    </div>
  `;
}

function renderAll() {
  const container = document.getElementById("container");

  let innerHtml = "";

  items.forEach((item) => {
    innerHtml += renderItem(item);
  });

  container.innerHTML = innerHtml;
}

function storeToLocal() {
  if (window.localStorage) {
    window.localStorage.setItem("elementItems", JSON.stringify(items));
  } else {
    alert("Local Storage unavailable, your data won't be saved");
  }
}

function saveAll() {
  const itemSelectors = document.querySelectorAll("input");

  let checkedCount = 0;
  let tempItems = [];
  itemSelectors.forEach((item, index) => {
    if (item.checked && checkedCount < 5) {
      checkedCount++;
      tempItems.push(items[index]);
    }
  });

  items = tempItems;

  renderAll();
  storeToLocal();
  if (checkedCount > 4) {
    alert("We could only save 5 items");
  }
}

function loadAll() {
  if (window.localStorage) {
    items = JSON.parse(window.localStorage.getItem("elementItems"));
    renderAll();
  } else {
    alert("Local Storage unavailable, your data won't be loaded");
  }
}

function run() {
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.open(
    "GET",
    "https://collectionapi.metmuseum.org/public/collection/v1/objects",
    false
  ); // false for synchronous request
  xmlHttp.send(null);

  ids = JSON.parse(xmlHttp.responseText).objectIDs.slice(0, 25);

  console.log(ids);

  collectAll();
  renderAll();
}
