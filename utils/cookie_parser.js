
function parseCookie(request){
   const list = {};
   const cookieHeader = request.get("Cookie");
   if(!cookieHeader) return;

   cookieHeader.split(";").forEach(cookie => {
    let [key,...value] = cookie.split("=");
    // حذف فاصله های اضافی
    key.trim();
    if(!key) return;

    const cookieValue = value.join("=").trim();
    if(!cookieValue) return;

    list[key] = decodeURIComponent(cookieValue);

   });
   return list;
}

module.exports = parseCookie;