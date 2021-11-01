const server = require("express")();
const axios = require("axios").default;
const cheerio = require('cheerio');

const port = 8000;

const flipkartHome = async (req,res,search)=>{
    try {
        var query_string = `https://www.flipkart.com/search?q=${search}`
        const sort = req.query.sort  
        if(sort){
            switch (sort) {
                case "relevance":
                    query_string+="&sort=relevance"
                    break;
                case "popularity":
                    query_string+="&sort=popularity"
                    break;
                case "price_asc":
                    query_string+="&sort=price_asc"
                    break;
                case "price_desc":
                    query_string+="&sort=price_desc"
                    break;
                case "recency_desc":
                    query_string+="&sort=recency_desc"
                    break;
                default:
                    break;
            }
        }
        console.log("Query string===>",query_string)
        const response = await axios.get(query_string); 
        const selector = cheerio.load(response.data);
        const row = selector("._2GoDe3").find("._13oc-S");
        var elements = []
        row.each((index,element)=>{
            const children = element.children
            for(let i =0 ;i < children.length;i++){
                var temp_obj = {}
                const new_obj = children[i];
                const img = selector(new_obj).find("img").attr("src")
                const title =  selector(new_obj).find(".s1Q9rs").text()
                const star_rating =  selector(new_obj).find("._3LWZlK").text()
                const price =  selector(new_obj).find("._30jeq3").text()
                const off =  selector(new_obj).find("._8VNy32 > ._25b18c > ._3Ay6Sb ").text() 
                const sub_heading =  selector(new_obj).find("._4ddWXP > ._3Djpdu").text()
                const MRP =  selector(new_obj).find("._3I9_wc").text()
                const id = selector(new_obj).find("a").attr("href").split("&")[0].split("?")[0]
                temp_obj["img"]=img
                temp_obj["title"]=title
                temp_obj["star_rating"]=star_rating
                temp_obj["price"]=price
                temp_obj["off"]=off
                temp_obj["sub_heading"]=sub_heading
                temp_obj["MRP"]=MRP
                temp_obj["id"]=id
                elements.push(temp_obj)
            }
        })    
        console.log(elements.length)
        res.status(200)
        res.json({
            "data":elements,
            "status":1
        })
    } catch (error) {
        console.log("error was ===>", error)
        res.status(500)
        res.json({
            "data":[],
            "status":0
        })
    }
}

const search_item = async (res,id) => {
    try {
        var query_string = `https://www.flipkart.com${id}`
        
        const response = await axios.get(query_string)
        const selector = cheerio.load(response.data)
        const title = selector(".yhB1nd").text() 
        const rating = selector("._1lRcqv").find("._3LWZlK").text() 
        const price = selector("._16Jk6d").text() 
        const additional_detail = selector("._2JC05C").text() 
        const highlight = selector("._2418kt").text().split("|") 
        const description = selector("._1mXcCf").text() 
        const specification = selector("._1UhVsV").html()
        const review = selector(".t-ZTKy > div > div")
        const total_review = []
        review.each((index,element)=>{
            total_review.push(selector(element).text())
        })
        const images = selector(".q6DClP")
        const total_images = []
        images.each((index,element)=>{
            const item = selector(element).attr("style").split(`(`)[1].split("?")[0]
            total_images.push(item)
        }) 
        const MRP = selector("._2p6lqe").text()
        res.status(200)
        res.json({
            "status":0,
            "message":"succesfull",
            "title":title,
            "rating":rating,
            "price":price,
            "additional_detail":additional_detail,
            "highlight":highlight,
            "description":description,
            "total_review":total_review,
            "total_images":total_images,
            "mrp":MRP,
            "specification_html":specification
        })
    } catch (error) {
        console.log("There was some problem",error)
        res.status(500)
        res.json({
            "status":1,
            "message":"There was some problem "
        })
    }
}
server.get("/flipkart",(req,res)=>{
    try {
        const search = req.query.q
        if(search.length>1){
            flipkartHome(req,res,search)    
        }else{
            res.status(200)
            res.json({
                "status":1,
                "message":"search query cannot be empty"
            })
        }
        
    } catch (error) {
        res.status(200)
        res.json({
            "status":1,
            "message":"search query needed"
        })
    }
    
})
server.get("/flipkart/productinfo",(req,res)=>{
    try {
        const search_id =  req.query.id
        if(search_id.length<3){
            res.status(200)
            res.json({
                "status":1,
                "message":"Invalid seearch id"
            })
        }
        search_item(res,search_id)
    } catch (error) {
        res.status(200)
        res.json({
            "status":1,
            "message":"Search id is requried"
        })
    }
    

})
server.listen(port,()=>{
    console.log("server is listening");
})