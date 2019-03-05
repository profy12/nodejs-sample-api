const request = async () => {
    let changed = false;
    const response = await fetch('http://127.0.0.1:8000/api/domain/');
    const json = await response.json();
    domainList = json;
    const domainListEl = document.getElementById('domain-list');
    domainList.forEach(domain=>{
        console.log(`Analyse de ${domain}`);
        if (domainListEl.contains(document.getElementById(domain))){
            console.log(`${domain} is already here`);
        } else {
            changed = true;
            const newChild = document.createElement("div");
            newChild.setAttribute('id', domain);
            newChild.setAttribute('class', 'domains');
            const childText = document.createTextNode(domain);
            newChild.appendChild(childText);
            domainListEl.appendChild(newChild);
            console.log(`${domain} added to div list`);
        }
    });
    if (changed) putEffect();
    //console.log(json);
};
request();
window.setInterval(request, 10000);
