const deleteProduct = (object) =>{
    const productId = object.parentNode.querySelector("[name=productId]").value;
    const csrf = object.parentNode.querySelector("[name=_csrf]").value;
    const productElement = object.closest("article");
    
    fetch(`/admin/delete-product/${productId}`,{
        method : "DELETE",
        headers : {
            "csrf-token" : csrf
        }
    }).then(result => {
        return result.json;
    }).then(data => {
        console.log(data);
        productElement.parentNode.removeChild(productElement);
    }).catch(err => {
        console.error(err);
    })
}