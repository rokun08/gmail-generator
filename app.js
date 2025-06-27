const e = React.createElement;
function App() {
  const [gmailList, setGmailList] = React.useState([]);
  const [history, setHistory] = React.useState([]);
  const [inputG, setInputG] = React.useState("");
  const [generated, setGenerated] = React.useState(null);
  const [sel, setSel] = React.useState([]);

  React.useEffect(() => {
    const gl = JSON.parse(localStorage.getItem("gmailList")) || [];
    const ht = JSON.parse(localStorage.getItem("history")) || [];
    setGmailList(gl); setHistory(ht);
  }, []);
  React.useEffect(() => {
    localStorage.setItem("gmailList", JSON.stringify(gmailList));
    localStorage.setItem("history", JSON.stringify(history));
  }, [gmailList, history]);

  const addG = () => {
    if (inputG && !gmailList.includes(inputG)) {
      setGmailList([...gmailList, inputG]);
      setInputG("");
    }
  };
  const imp = (e) => {
    const f = e.target.files[0];
    if (f && f.type === "text/plain") {
      const r = new FileReader();
      r.onload = (ev) => {
        const lines = ev.target.result.split("\n").map(l=>l.trim())
          .filter(l=>l && !gmailList.includes(l));
        setGmailList([...gmailList, ...lines]);
      };
      r.readAsText(f);
    }
  };
  const gen = () => {
    const rem = gmailList.filter(g=>!history.includes(g));
    if (!rem.length) return;
    const rand = rem[Math.floor(Math.random()*rem.length)];
    setGenerated(rand);
    setHistory([...history, rand]);
  };
  const copy = () => {
    if (generated) navigator.clipboard.writeText(generated);
  };
  const tog = (g) => {
    setSel(sel.includes(g) ? sel.filter(x=>x!==g) : [...sel, g]);
  };
  const del = () => {
    setHistory(history.filter(g=>!sel.includes(g)));
    setSel([]);
  };

  return e('div',{style:{fontFamily:'sans-serif',padding:'20px'}},
    e('h1',null,'Gmail Generator'),
    e('div',null,
      e('input',{value:inputG,onChange:ev=>setInputG(ev.target.value),placeholder:'Add Gmail'}),
      e('button',{onClick:addG},'Add')
    ),
    e('div',null,
      e('label',null,'Import .txt:'),
      e('input',{type:'file',accept:'.txt',onChange:imp})
    ),
    e('div',null,
      e('button',{onClick:gen},'Generate'),
      e('button',{onClick:copy},'Copy')
    ),
    generated && e('div',null,`Generated: ${generated}`),
    e('div',null,`Used: ${history.length} of ${gmailList.length}`),
    e('h2',null,'History'),
    e('ul',null,
      history.map(g=>e('li',{key:g},
        e('input',{type:'checkbox',checked:sel.includes(g),onChange:()=>tog(g)}),
        g
      ))
    ),
    e('button',{onClick:del,disabled:!sel.length},'Delete Selected')
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(e(App));
