const partners = [
    {
        name: "COSTCO WHOLESALE",
        description: "Siempre que compres algo en Costco no temas en preguntar por nosotros",
        logo: "https://www.costco.com/wcsstore/CostcoGLOBALSAS/images/Costco_Logo-1.png"
    },
    {
        name: "FEDEX",
        description: "Algunos de los paquetes de Fedex nosotros nos encargamos de entregar",
        logo: "https://www.fedex.com/content/dam/fedex-com/logos/FedEx-Logo.png"
    },
    {
        name: "PRIVADO",
        description: "También nos puedes encontrar por privado",
        logo: "faviconblue.png"
    }
];

let currentPartner = 0;
const partnerContent = document.querySelector('.partner-content');
const partnerLogo = document.getElementById('partnerLogo');
const partnerName = document.getElementById('partnerName');
const partnerDescription = document.getElementById('partnerDescription');

function updatePartner() {
 
    partnerContent.classList.add('fade-out');
    partnerLogo.classList.add('fade-out');

    setTimeout(() => {
        
        currentPartner = (currentPartner + 1) % partners.length;
        partnerName.textContent = partners[currentPartner].name;
        partnerDescription.textContent = partners[currentPartner].description;
        partnerLogo.src = partners[currentPartner].logo;
        partnerLogo.alt = `${partners[currentPartner].name} Logo`;

      
        partnerContent.classList.remove('fade-out');
        partnerLogo.classList.remove('fade-out');
    }, 500);
}



setInterval(updatePartner, 4000);