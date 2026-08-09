const starterIssues=[
{id:1,title:"Broken classroom fan",category:"Infrastructure",location:"Block A, Room 204",description:"The ceiling fan has stopped working and the classroom becomes uncomfortable.",status:"Reported",votes:8,date:"Today"},
{id:2,title:"Overflowing dustbin",category:"Cleanliness",location:"Near Central Library",description:"The dustbin has been full since yesterday and needs attention.",status:"In Progress",votes:14,date:"Today"},
{id:3,title:"Wi-Fi not available",category:"Technology",location:"Block B, 1st Floor",description:"Students are unable to connect to the campus Wi-Fi in this area.",status:"Resolved",votes:21,date:"Yesterday"},
{id:4,title:"Water leakage",category:"Infrastructure",location:"Cafeteria Entrance",description:"There is water leakage near the entrance and the floor becomes slippery.",status:"In Progress",votes:11,date:"Yesterday"},
{id:5,title:"Street light issue",category:"Safety",location:"Parking Area",description:"One of the lights near the parking area is not working at night.",status:"Reported",votes:17,date:"2 days ago"}];
let issues=JSON.parse(localStorage.getItem("campusIssues"))||starterIssues;
const $=id=>document.getElementById(id);
function save(){localStorage.setItem("campusIssues",JSON.stringify(issues))}
function statusClass(s){return s==="In Progress"?"status-progress":s==="Resolved"?"status-resolved":"status-reported"}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function render(){
 const search=$("searchInput").value.toLowerCase().trim(),cat=$("categoryFilter").value,stat=$("statusFilter").value;
 const filtered=issues.filter(i=>`${i.title} ${i.description} ${i.location}`.toLowerCase().includes(search)&&(cat==="all"||i.category===cat)&&(stat==="all"||i.status===stat));
 $("issuesGrid").innerHTML=filtered.map(i=>`<article class="issue-card">${i.photo?`<img class="issue-image" src="${i.photo}" alt="Report photo">`:`<div class="issue-image"></div>`}<div class="issue-content"><div class="issue-top"><span class="status ${statusClass(i.status)}">${i.status}</span><span class="category">${escapeHtml(i.category)}</span></div><h3>${escapeHtml(i.title)}</h3><p class="description">${escapeHtml(i.description)}</p><p class="location">📍 ${escapeHtml(i.location)}</p><div class="issue-footer"><button class="upvote" onclick="upvote(${i.id})">👍 Support <b>${i.votes}</b></button><span class="meta">${i.date}</span></div></div></article>`).join("");
 $("emptyState").classList.toggle("hidden",filtered.length!==0);
 const total=issues.length,reported=issues.filter(i=>i.status==="Reported").length,progress=issues.filter(i=>i.status==="In Progress").length,resolved=issues.filter(i=>i.status==="Resolved").length;
 $("totalIssues").textContent=total;$("pendingIssues").textContent=reported;$("progressIssues").textContent=progress;$("resolvedIssues").textContent=resolved;$("heroReported").textContent=reported;$("heroInProgress").textContent=progress;$("heroResolved").textContent=resolved;
}
function upvote(id){const i=issues.find(x=>x.id===id);if(!i)return;i.votes++;save();render();showToast("Thanks! Your support was added.")}
function openModal(){$("reportModal").classList.remove("hidden");$("title").focus()}
function closeModal(){$("reportModal").classList.add("hidden");$("reportForm").reset();$("photoPreview").innerHTML="";$("photoPreview").classList.add("hidden")}
function showToast(m){const t=$("toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)}
$("openReportBtn").onclick=openModal;$("heroReportBtn").onclick=openModal;$("closeModalBtn").onclick=closeModal;
$("reportModal").addEventListener("click",e=>{if(e.target===$("reportModal"))closeModal()});
["searchInput","categoryFilter","statusFilter"].forEach(id=>{$(id).addEventListener("input",render);$(id).addEventListener("change",render)});
$("photo").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$("photoPreview").innerHTML=`<img src="${r.result}" alt="Selected report photo">`;$("photoPreview").classList.remove("hidden")};r.readAsDataURL(f)});
$("reportForm").addEventListener("submit",e=>{e.preventDefault();const f=$("photo").files[0],create=p=>{issues.unshift({id:Date.now(),title:$("title").value.trim(),category:$("category").value,location:$("location").value.trim(),description:$("description").value.trim(),status:"Reported",votes:0,date:"Just now",photo:p||""});save();render();closeModal();showToast("Report submitted successfully! 🎉")};if(f){const r=new FileReader();r.onload=()=>create(r.result);r.readAsDataURL(f)}else create("")});
render();