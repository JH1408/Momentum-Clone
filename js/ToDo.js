var list = document.querySelector("#TDlist-box"),
  form = document.querySelector("#ToDoForm"),
  item = document.querySelector("#TDitem"),
  click = document.querySelector("#TDClick"),
  typeSelect = document.querySelector("#conf-i"),
  TDtypeChoices = document.querySelector("#TDtype-choice-Box"),
  TDtypeChoice = document.querySelectorAll(".TDtypeChoice"),
  TDBox = document.querySelector("#ToDo-box"),
  TDtype = `TD_${document.querySelector("#TDtype").innerText}`,
  i = 0;
if (!localStorage.getItem(TDtype)) {
  var TDitems = {};
} else {
  TDitems = JSON.parse(localStorage.getItem(TDtype));
}

//Add new Task to the list
form.addEventListener(
  "submit",
  function(e) {
    e.stopPropagation();
    e.preventDefault();
    //Check if TDitems is not 0
    var i = Object.keys(TDitems).length;
    if (i == 0 || document.querySelector("#TD_New_Box") !== null) {
      list.innerHTML = "";
    }
    //Setting up Storage name(Skip if exists)
    i++;
    var d = new Date(),
      dd = ("0" + d.getDate()).slice(-2),
      mm = ("0" + (d.getMonth() + 1)).slice(-2),
      TDBase = TDtype + mm + dd + "_",
      TDkey = TDBase + i;
    while (TDitems[TDkey]) {
      TDkey = TDBase + i;
      if (Object.keys(TDitems).indexOf(TDkey) >= 0) {
        i++;
      }
    }
    //Store Key&Item
    TDitems[TDkey] = item.value;
    list.innerHTML +=
      '<div class="custom-control custom-checkbox TDValue"><input type="checkbox" name =' +
      TDtype +
      ' class="custom-control-input ' +
      TDtype +
      '" id=' +
      TDkey +
      '> <label class="custom-control-label TDcontent" for=' +
      TDkey +
      ">" +
      item.value +
      '</label><div class="itemOptModal" style="display:none"><p class="DelModalItem">Edit</p>' +
      '<p class="DelModalItem" onclick="mvToday(this.parentNode)">Move to Today</p>' +
      '<p class="DelModalItem" onclick="rmTD()">Delete Selected</p>' +
      '<p class="DelModalItem" onclick="rmItem(this.parentNode)">Delete</p></div><i class="fa fa-ellipsis-h pull-right itemOpt" onclick="itemOptModalToggle(this.previousElementSibling)" style="display:none"></i></div>';
    item.value = "";
    setitemOpt();
    store();
  },
  false
);

function FirstTodo() {
  list.innerHTML =
    '<div id="TD_New_Box">' +
    '<h5 class="TD_New_title">Add a todo to get started</h5>' +
    '<p class="TD_Today_link">Switch to Today <i class="fa fa-angle-right"></i></p>' +
    '<button id="TD_New_btn">New Todo</button>' +
    "</div>";
  var TD_New_Box = document.querySelector("#TD_New_Box"),
    TD_GoTo_Today = document.querySelector(".TD_Today_link");
  TD_New_Box.addEventListener(
    "click",
    function(e) {
      e.stopPropagation();
      e.preventDefault();
      list.innerHTML = "";
    },
    false
  );
  TD_GoTo_Today.addEventListener(
    "click",
    function(e) {
      LoadTDtype("Today");
    },
    false
  );
}

function LoadTDtype(type) {
  document.querySelector("#TDtype").innerText = type;
  TDtype = `TD_${document.querySelector("#TDtype").innerText}`;
  if (!localStorage.getItem(TDtype)) {
    TDitems = {};
    if (TDtype == "TD_Inbox") {
      FirstTodo();
    } else {
      list.innerHTML = "";
    }
  } else {
    TDitems = JSON.parse(localStorage.getItem(TDtype));
    setTimeout(setValues, 100);
  }
}

//Show ToDo lists
click.addEventListener(
  "click",
  function() {
    if (!click.classList.contains("active")) {
      setValues();
      TDBox.style.display = "table";
      click.classList.add("active");
      if (!localStorage.getItem(TDtype)) {
        FirstTodo();
      } else {
        TDitems = JSON.parse(localStorage.getItem(TDtype));
      }
    } else {
      TDBox.style.display = "none";
      click.classList.remove("active");
    }
  },
  false
);

//Show Type Select
typeSelect.addEventListener(
  "click",
  function() {
    if (!typeSelect.classList.contains("active")) {
      TDtypeChoices.style.display = "table";
      typeSelect.classList.add("active");
    } else {
      TDtypeChoices.style.display = "none";
      typeSelect.classList.remove("active");
    }
    for (var i = 0; i < TDtypeChoice.length; i++) {
      TDtypeChoice[i].addEventListener(
        "click",
        function() {
          document.querySelector("#TDtype").innerText = this.innerText;
          LoadTDtype(this.innerText);
          TDtypeChoices.style.display = "none";
          typeSelect.classList.remove("active");
        },
        false
      );
    }
  },
  false
);

function store() {
  localStorage.setItem(TDtype, JSON.stringify(TDitems));
}

function rmTD() {
  var del = [];
  // Set up variable to load TDlist names dynamically
  var TDLists = document.getElementsByName(TDtype);
  //Get Keys&Number of the item to delete
  for (var i = 0; i < TDLists.length; i++) {
    if (TDLists[i].checked) {
      console.log(i);
      del.push(Object.keys(TDitems)[i]);
    }
  }
  //Make Associative Array named "Done"
  if (TDtype !== "TD_Done") {
    done = {};
    del.map(function(i) {
      done[i] = TDitems[i];
    });
    if (localStorage.getItem("TD_Done")) {
      var DoneList = JSON.parse(localStorage.getItem("TD_Done"));
      Object.assign(done, DoneList);
    }
    localStorage.setItem("TD_Done", JSON.stringify(done));
  }
  //If AllLists checked, delete all
  if (del.length == document.TDListbox.length) {
    localStorage.removeItem(TDtype);
    list.innerHTML = "";
    TDitems = {};
    if (TDtype == "TD_Inbox") {
      FirstTodo();
    }
  } else {
    // Delete from HTML
    del.map(function(i) {
      var v = document.getElementById(i);
      v.parentNode.remove();
    });
    //Delete from TDitems
    del.map(function(i) {
      return delete TDitems[i];
    });
    store();
  }
}

function itemOptModalToggle(v) {
  v.style.display == "none"
    ? (v.style.display = "table")
    : (v.style.display = "none");
}

function setitemOpt() {
  var TDValue = document.querySelectorAll(".TDValue"),
    itemOpt = document.querySelectorAll(".itemOpt");
  function itemOptShow(i) {
    itemOpt[i].style.display = "inline";
  }

  function itemOptHide(i) {
    itemOpt[i].style.display = "none";
  }

  for (var i = 0; i < TDValue.length; i++) {
    (function(i) {
      TDValue[i].addEventListener(
        "mouseover",
        function() {
          itemOptShow(i);
        },
        false
      );
      TDValue[i].addEventListener(
        "mouseleave",
        function() {
          itemOptHide(i);
        },
        false
      );
    })(i);
  }
}

function rmItem(v) {
  var RDkey = v.previousElementSibling.htmlFor;
  delete TDitems[RDkey];
  v.parentNode.remove();
  store();
}

function mvToday(v) {
  var TodayContent = v.previousElementSibling.innerText,
    TDkey = v.previousElementSibling.htmlFor,
    TDToday = JSON.parse(localStorage.getItem("TD_Today"));
  v.parentNode.remove();
  TDToday[TDkey] = TodayContent;
  delete TDitems[TDkey];
  localStorage.setItem("TD_Today", JSON.stringify(TDToday));
  store();
}

function setValues(TDkey) {
  if (!TDitemHTML) {
    var TDitemHTML = "";
    for (TDkey in TDitems) {
      TDitemHTML +=
        '<div class="custom-control custom-checkbox d-flex TDValue"><input type="checkbox" name =' +
        TDtype +
        ' class="custom-control-input ' +
        TDtype +
        '" id=' +
        TDkey +
        '><label class="custom-control-label TDcontent" for=' +
        TDkey +
        ">" +
        TDitems[TDkey] +
        '</label><div class="itemOptModal" style="display:none"><p class="DelModalItem">Edit</p>' +
        '<p class="DelModalItem" onclick="mvToday(this.parentNode)">Move to Today</p>' +
        '<p class="DelModalItem" onclick="rmTD()">Delete Selected</p>' +
        '<p class="DelModalItem" onclick="rmItem(this.parentNode)">Delete</p></div><i class="fa fa-ellipsis-h itemOpt" onclick="itemOptModalToggle(this.previousElementSibling)" style="display:none"></i></div>';
    }
  }
  list.innerHTML = TDitemHTML;
  setitemOpt();
}
