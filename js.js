const filters = {
    Brightness:{ value:100,
        defaultValue : 100,
        min:0,
        max:200,
        unit:"%"
    },
    Contrast: { value:100,
        defaultValue : 100,
        min:0,
        max:200,
        unit:"%"
    },
    Saturation: { value:100,
        defaultValue : 100,
        min:0,
        max:200,
        unit:"%"
    },
    HueRotation:{ value:0,
        defaultValue : 0,
        min:0,
        max:360,
        unit:"deg"
    },
    Blur:{ value: 0,
        defaultValue : 0,
        min:0,
        max:20,
        unit:"px"
    },
    Grayscale: { value:0,
        defaultValue : 0,
        min:0,
        max:100,
        unit:"%"
    },
    Sepia : { value:0,
        defaultValue : 0,
        min:0,
        max:100,
        unit:"%"
    },
    Opacity:{ value:100,
        defaultValue : 100,
        min:0,
        max:100,
        unit:"%"
    },
    Invert :{ value:0,
        defaultValue : 0,
        min:0,
        max:100,
        unit:"%"
    },
} 

const filtersContainer = document.querySelector(".filters")
const imageCanvas = document.querySelector("#image-canvas")
const imageInput = document.querySelector("#image-input")
const canvasCtx = imageCanvas.getContext("2d")
const resetBtn = document.querySelector("#reset-btn")
const downloadBtn = document.querySelector("#download-btn")
let originalImage = null


function createFilterElement(name, unit = "%", value, min, max){
    const div = document.createElement("div")
    div.classList.add("filter")

    const input = document.createElement("input")
    input.type ="range"
    input.min=min
    input.max=max
    input.value=value
    input.id=name

    const p = document.createElement("p")
    p.innerText= name

    div.appendChild(p)
    div.appendChild(input)

    input.addEventListener("input",(e)=>{
        filters[name].value = input.value
        applyFilter()
    })

    return div
}

Object.keys(filters).forEach(key=>{

     const filterElement = createFilterElement(key, filters[key].unit, filters[key].value, filters[key].min, filters[key].max)

     
     


     filtersContainer.appendChild(filterElement)
})

imageInput.addEventListener("change", (e)=>{

    const file = e.target.files[0]
    if (!file) return
    const imagePlaceHolder= document.querySelector(".placeholder")
    imagePlaceHolder.style.display = "none"
    
    const img = new Image()
    img.src =URL.createObjectURL(file)

   
 img.onload = ()=>{

    originalImage = img    
    imageCanvas.width = img.width;
    imageCanvas.height = img.height;

        
         applyFilter()

      URL.revokeObjectURL(img.src);   
    }

})      

function applyFilter(){

     if (!originalImage) return;

    canvasCtx.clearRect(0,0,imageCanvas.width,imageCanvas.height)
    
    canvasCtx.filter = `
    brightness(${filters.Brightness.value}${filters.Brightness.unit})
    contrast(${filters.Contrast.value}${filters.Contrast.unit})
    saturate(${filters.Saturation.value}${filters.Saturation.unit})
    hue-rotate(${filters.HueRotation.value}${filters.HueRotation.unit})
    blur(${filters.Blur.value}${filters.Blur.unit})
    grayscale(${filters.Grayscale.value}${filters.Grayscale.unit})
    sepia(${filters.Sepia.value}${filters.Sepia.unit})
    opacity(${filters.Opacity.value}${filters.Opacity.unit})
    invert(${filters.Invert.value}${filters.Invert.unit})
    `.trim()

    canvasCtx.drawImage(originalImage, 0, 0)
    canvasCtx.filter = "none"

}


resetBtn.addEventListener("click", ()=>{
    Object.keys(filters).forEach((name) =>{
        filters[name].value = filters[name].defaultValue
        const input = document.querySelector(`#${name}`)
        input.value = filters[name].defaultValue
    });
    applyFilter()

})

downloadBtn.addEventListener("click", ()=>{
    if(!originalImage){
        return;
    }
    const link = document.createElement("a")
    link.download = "edited-image.jpg"
    link.href =imageCanvas.toDataURL("image/jpeg", 0.9)
    link.click()



})


imageCanvas.addEventListener("click", () => {
    if(!originalImage){
    imageInput.click();}
});