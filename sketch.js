var database;
var dog,dogImage,dogImage1,food,foodImage,foodStock,foodRef;
var feed;
var fedTime,lastFed,foodRem;
var foodObj;
var value;
var milkimg,milkbottle;
var washroom,garden,bedroom;
var readState;
var gameState;
function preload()
{
  dogimage = loadImage("dogimg.png");
  dogimage2 = loadImage("dogimg1.png");
  washroom = loadImage("Wash Room.png");
  garden = loadImage("Garden.png");
  bedroom = loadImage("Bed Room.png");
  milkimg = loadImage("Milk.png");
}

function setup() {
  createCanvas(800, 500);
  database = firebase.database();
  foodObj=new Food();
   
   readState = database.ref("gameState");
   readState.on("value",function(data){

    gameState = data.val();

   });

  dog = createSprite(450,300);
  dog.addImage(dogimage);
  dog.scale = 0.2;

 
  
  feed = createButton("Feed your dog");
  feed.position(750,200);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(870,200);
  addFood.mousePressed(addFoods);
  
  

  milkbottle = createSprite(370,320)
  milkbottle.addImage(milkimg)
  milkbottle.visible = 0
  milkbottle.scale = 0.1
}


function draw() {  
 
  background(46, 139, 87);
  drawSprites();
 
 
  foodObj.display();
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })
  fill("white");
  textSize(15);
  if(lastFed>=12){
    text("Last Fed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Fed : 12 AM",350,30);
   }else{
     text("Last Fed : "+ lastFed + " AM", 350,30);
   }
   fill(4,23,117)
   textSize(20)
   text(value,400,dog.y-80)

   if(gameState!=="Hungry"){

     feed.hide();
     addFood.hide();
     dog.visible = false;
     
   }

   else{

     feed.show();
     addFood.show();
     dog.visible = true;

   }

   currentTime = hour();
    if(currentTime ==(lastFed+1)){

      update("Playing");
      foodObj.Garden();

    }
   else if(currentTime ==(lastFed+2)){

    update("Sleeping");
    foodObj.bedRoom();

  }
  else if(currentTime ==(lastFed+3)){

    update("Bathing");
    foodObj.washRoom();

  }

  else{

    update("Hungry")
    foodObj.display();
  }

}
function feedDog()
{
  foodObj.getFoodStock();
  if(foodObj.foodStock<=0)
  {
    foodObj.foodStock=0;
    milkbottle.visible=0;
    dog.addImage(dogimage);
  }
  else{
    dog.addImage(dogimage2);
    if(foodObj.foodStock===1)
    {
        milkbottle.visible=0;
        dog.addImage(dogimage);
    }
    else
    milkbottle.visible = 1
    foodObj.updateFoodStock(foodObj.foodStock-1);
    database.ref('/').update({
    Food:foodObj.foodStock,
    FeedTime:hour()
    });
  }
}
function addFoods()
{
  if(foodObj.foodStock<=19){
  foodObj.updateFoodStock(foodObj.foodStock+1);
  database.ref('/').update({
    Food:foodObj.foodStock
  });
  }
}

function update(state){

  database.ref("/").update({

   gameState:state

  })


}


