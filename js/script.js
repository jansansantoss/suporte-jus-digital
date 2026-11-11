/* SUPORTE JUS DIGITAL | Interações e desafio extra em JavaScript puro */
"use strict";

// Catálogo construído com array de objetos, conforme a opção de catálogo dinâmico.
const services = [
  { id: 1, image: "img/servico-sistemas.svg", name: "Configuração de PJe e sistemas judiciais", category: "sistemas", label: "Sistemas judiciais", icon: "⚖", short: "Configuração de acesso e ajustes necessários para utilização de plataformas judiciais.", detail: "Auxílio na preparação do navegador, componentes e configurações do computador para acesso a sistemas como PJe, e-SAJ, e-Proc, PROJUDI e outros. A disponibilidade e os requisitos variam conforme o tribunal." },
  { id: 2, image: "img/servico-certificados.svg", name: "Certificado digital (A1, A3, token e smartcard)", category: "certificados", label: "Certificados", icon: "◇", short: "Instalação, reconhecimento e configuração de certificados digitais e dispositivos.", detail: "Suporte para instalação e configuração de certificados digitais, drivers de tokens e smartcards, além de testes de reconhecimento no ambiente do usuário. A emissão e renovação devem ser realizadas pela autoridade certificadora." },
  { id: 3, image: "img/servico-ambientes.svg", name: "Preparação de ambiente Windows", category: "ambientes", label: "Ambientes de TI", icon: "▣", short: "Ajustes de sistema, navegador, permissões e componentes para a rotina jurídica.", detail: "Verificação e preparação do ambiente Windows, com foco em compatibilidade, navegadores, atualizações e componentes utilizados no acesso aos sistemas judiciais." },
  { id: 4, image: "img/servico-ambientes.svg", name: "Configuração de ambiente macOS", category: "ambientes", label: "Ambientes de TI", icon: "⌘", short: "Orientação técnica para uso de ferramentas jurídicas em computadores Apple.", detail: "Configuração de navegadores, permissões, certificados e componentes compatíveis com macOS, considerando as particularidades do equipamento e dos sistemas utilizados." },
  { id: 5, image: "img/servico-ambientes.svg", name: "Preparação de ambiente Linux", category: "ambientes", label: "Ambientes de TI", icon: "⌁", short: "Ajustes e orientações para acesso a plataformas judiciais em Linux.", detail: "Análise do ambiente Linux, instalação de componentes compatíveis e orientação para configuração de navegadores e certificados, conforme os requisitos técnicos da plataforma judicial." },
  { id: 6, image: "img/servico-sistemas.svg", name: "Suporte remoto e diagnóstico técnico", category: "sistemas", label: "Suporte especializado", icon: "◎", short: "Atendimento remoto para identificar e solucionar dificuldades técnicas.", detail: "Atendimento remoto mediante autorização do cliente para diagnosticar falhas de acesso, configurações e incompatibilidades. Casos que exigirem intervenção física podem demandar atendimento presencial." }
];

const serviceGrid = document.getElementById("serviceGrid");
const searchInput = document.getElementById("serviceSearch");
const filterButtons = document.querySelectorAll(".filter-btn");
const emptyState = document.getElementById("emptyState");
const favoriteCount = document.getElementById("favoriteCount");
const favoritesList = document.getElementById("favoritesList");
let activeFilter = "todos";
let searchTerm = "";

function getFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem("sjd-favorites") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.warn("Não foi possível ler os favoritos salvos.", error);
    return [];
  }
}

function saveFavorites(favorites) {
  try {
    localStorage.setItem("sjd-favorites", JSON.stringify(favorites));
  } catch (error) {
    console.warn("Não foi possível salvar os favoritos neste navegador.", error);
  }
}

function renderServices() {
  const favorites = getFavorites();
  const filtered = services.filter((service) => {
    const matchesCategory = activeFilter === "todos" || service.category === activeFilter;
    const searchable = `${service.name} ${service.short} ${service.label}`.toLocaleLowerCase("pt-BR");
    return matchesCategory && searchable.includes(searchTerm);
  });

  serviceGrid.innerHTML = filtered.map((service) => {
    const isFavorite = favorites.includes(service.id);
    return `
      <div class="col-md-6 col-lg-4">
        <article class="card service-card">
          <img class="service-card-image" src="${service.image}" alt="Ilustração do serviço: ${service.name}" loading="lazy">
          <div class="service-card-top">
            <div class="service-icon" aria-hidden="true">${service.icon}</div>
            <button class="favorite-btn ${isFavorite ? "is-favorite" : ""}" type="button"
              data-favorite="${service.id}" aria-label="${isFavorite ? "Remover dos" : "Adicionar aos"} favoritos"
              aria-pressed="${isFavorite}">${isFavorite ? "♥" : "♡"}</button>
          </div>
          <span class="service-category">${service.label}</span>
          <h3>${service.name}</h3>
          <p>${service.short}</p>
          <div class="service-card-actions">
            <button class="service-detail-btn" type="button" data-details="${service.id}">Ver detalhes →</button>
            <button class="add-cart-btn ${getCart().includes(service.id) ? "in-cart" : ""}" type="button" data-cart="${service.id}" aria-label="${getCart().includes(service.id) ? "Remover" : "Adicionar"} ${service.name} ${getCart().includes(service.id) ? "do" : "ao"} carrinho">${getCart().includes(service.id) ? "✓ No carrinho" : "+ Carrinho"}</button>
            <span class="text-muted small">#0${service.id}</span>
          </div>
        </article>
      </div>`;
  }).join("");

  emptyState.classList.toggle("d-none", filtered.length > 0);
  updateFavoriteCount();
  updateCartCount();
}

function updateFavoriteCount() {
  favoriteCount.textContent = getFavorites().length;
  document.getElementById("favoriteCountCatalog").textContent = getFavorites().length;
}

function toggleFavorite(id) {
  const favorites = getFavorites();
  const updated = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
  saveFavorites(updated);
  renderServices();
  renderFavorites();
}

function showServiceDetails(id) {
  const service = services.find((item) => item.id === id);
  if (!service) return;
  document.getElementById("modalServiceIcon").textContent = service.icon;
  document.getElementById("serviceModalTitle").textContent = service.name;
  document.getElementById("serviceModalDescription").textContent = service.detail;
  document.getElementById("serviceModalCategory").textContent = service.label;
  bootstrap.Modal.getOrCreateInstance(document.getElementById("serviceModal")).show();
}

function renderFavorites() {
  const favorites = getFavorites();
  const chosen = services.filter((service) => favorites.includes(service.id));
  if (!chosen.length) {
    favoritesList.innerHTML = '<div class="no-favorites">Você ainda não salvou serviços. Use o coração nos cards para adicioná-los.</div>';
    return;
  }
  favoritesList.innerHTML = chosen.map((service) => `
    <div class="favorite-row">
      <div><strong>${service.name}</strong><small>${service.label}</small></div>
      <button class="remove-favorite" type="button" data-remove-favorite="${service.id}">Remover</button>
    </div>`).join("");
}

// Delegação de eventos: ações dos cards dinâmicos.
serviceGrid.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  const detailButton = event.target.closest("[data-details]");
  const cartButton = event.target.closest("[data-cart]");
  if (favoriteButton) toggleFavorite(Number(favoriteButton.dataset.favorite));
  if (detailButton) showServiceDetails(Number(detailButton.dataset.details));
  if (cartButton) toggleCart(Number(cartButton.dataset.cart));
});

favoritesList.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-favorite]");
  if (removeButton) toggleFavorite(Number(removeButton.dataset.removeFavorite));
});

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value.trim().toLocaleLowerCase("pt-BR");
  renderServices();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderServices();
  });
});

document.getElementById("favoritesModal").addEventListener("show.bs.modal", renderFavorites);


// DESAFIO EXTRA — OPÇÃO 1: carrinho com inclusão e remoção.
// OPÇÃO 2: persistência no localStorage (também utilizada nos favoritos).
const CART_KEY = "sjd-cart-v3";
const cartList = document.getElementById("cartList");
function getCart() {
  try {
    const ids = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(ids) ? [...new Set(ids.filter(id => Number.isInteger(id) && services.some(s => s.id === id)))] : [];
  } catch (error) { console.warn("Carrinho indisponível", error); return []; }
}
function saveCart(ids) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(ids)); }
  catch (error) { console.warn("Não foi possível persistir o carrinho", error); }
}
function updateCartCount() {
  document.getElementById("cartCount").textContent = getCart().length;
}
function toggleCart(id) {
  const ids = getCart();
  saveCart(ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id]);
  renderServices();
  renderCart();
}
function renderCart() {
  const ids = getCart();
  const selected = services.filter(service => ids.includes(service.id));
  cartList.innerHTML = selected.length ? selected.map(service => `
    <div class="favorite-row"><div><strong>${service.name}</strong><small>${service.label}</small></div>
    <button class="remove-favorite" type="button" data-remove-cart="${service.id}" aria-label="Remover ${service.name} do carrinho">Remover</button></div>`).join("")
    : '<div class="no-favorites">Seu carrinho está vazio. Clique em “+ Carrinho” nos cards para adicionar serviços.</div>';
  document.getElementById("cartSummary").textContent = `${selected.length} serviço(s) selecionado(s) • Orçamento sob consulta, sem pagamento online.`;
  document.getElementById("requestQuote").disabled = selected.length === 0;
  document.getElementById("clearCart").disabled = selected.length === 0;
  updateCartCount();
}
cartList.addEventListener("click", event => {
  const button = event.target.closest("[data-remove-cart]");
  if (button) toggleCart(Number(button.dataset.removeCart));
});
document.getElementById("cartModal").addEventListener("show.bs.modal", renderCart);
document.getElementById("clearCart").addEventListener("click", () => { saveCart([]); renderServices(); renderCart(); });
document.getElementById("requestQuote").addEventListener("click", () => {
  const selected = services.filter(service => getCart().includes(service.id));
  if (!selected.length) return;
  const subject = document.getElementById("subject");
  const message = document.getElementById("message");
  subject.value = "Outro suporte técnico";
  const summary = `Gostaria de solicitar orçamento para os seguintes serviços:\n${selected.map((service, index) => `${index + 1}. ${service.name}`).join("\n")}\n\nPor favor, informem as condições de atendimento.`;
  message.value = summary;
  bootstrap.Modal.getOrCreateInstance(document.getElementById("cartModal")).hide();
  document.getElementById("contato").scrollIntoView({behavior: "smooth"});
  document.getElementById("formFeedback").textContent = "Lista inserida no formulário. Preencha seus dados e revise antes de preparar o e-mail.";
});

// Validação própria do formulário com JavaScript (não depende apenas do Bootstrap).
const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");
const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("input", (event) => {
  let digits = event.target.value.replace(/\D/g, "").slice(0, 11);
  if (digits.length > 10) digits = digits.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
  else if (digits.length > 6) digits = digits.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  else if (digits.length > 2) digits = digits.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  else if (digits.length > 0) digits = digits.replace(/^(\d*)/, "($1");
  event.target.value = digits;
});

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formFeedback.className = "form-feedback";
  formFeedback.textContent = "";

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const subject = document.getElementById("subject");
  const message = document.getElementById("message");
  const privacy = document.getElementById("privacy");

  [name, email, subject, message, privacy].forEach((field) => {
    field.classList.remove("is-invalid");
    if (field.type === "checkbox") field.closest(".form-check").classList.remove("was-invalid");
  });

  let valid = true;
  if (name.value.trim().length < 3) { name.classList.add("is-invalid"); valid = false; }
  if (!validateEmail(email.value.trim())) { email.classList.add("is-invalid"); valid = false; }
  if (!subject.value) { subject.classList.add("is-invalid"); valid = false; }
  if (message.value.trim().length < 10) { message.classList.add("is-invalid"); valid = false; }
  if (!privacy.checked) { privacy.classList.add("is-invalid"); valid = false; }

  if (!valid) {
    formFeedback.textContent = "Revise os campos destacados antes de continuar.";
    formFeedback.classList.add("error");
    return;
  }

  // GitHub Pages é hospedagem estática: mailto entrega ao aplicativo de e-mail,
  // não representa envio automático nem garante que o destinatário receberá.
  const destinatario = ""; // OPCIONAL: preencha com o e-mail real da empresa.
  const assunto = `[Suporte Jus Digital] ${subject.value}`;
  const corpo = [
    `Nome: ${name.value.trim()}`,
    `E-mail de retorno: ${email.value.trim()}`,
    `Telefone: ${phoneInput.value.trim() || "Não informado"}`,
    `Assunto: ${subject.value}`,
    "",
    message.value.trim()
  ].join("\n");
  const mailto = `mailto:${destinatario}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
  formFeedback.textContent = "Dados validados. Seu aplicativo de e-mail será aberto com a mensagem preenchida. Informe o destinatário, revise e clique em Enviar no aplicativo para concluir.";
  formFeedback.classList.add("success");
  window.location.href = mailto;

});

document.getElementById("currentYear").textContent = new Date().getFullYear();

// Fecha o menu mobile após selecionar uma âncora.
document.querySelectorAll(".navbar-nav .nav-link, .navbar-nav .btn-nav").forEach((link) => {
  link.addEventListener("click", () => {
    const menu = document.getElementById("menuPrincipal");
    if (menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  });
});

renderServices();
renderFavorites();

renderCart();
