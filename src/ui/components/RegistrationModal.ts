import { GameState, PlayerGrade } from "../../systems/GameState";
import { AudioSystem } from "../../systems/AudioSystem";
import { Icons, icon } from "../Icons";

export class RegistrationModal {
  private container: HTMLElement;
  private onStartCallback: () => void;
  private selectedGrade: PlayerGrade = "3";

  constructor(onStartCallback: () => void) {
    this.onStartCallback = onStartCallback;
    this.container = document.createElement("div");
    this.container.className = "modal-overlay active";
    this.container.id = "modal-registration";

    this.render();
    document.body.appendChild(this.container);
    this.bindEvents();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="modal-box">
        <h1 class="start-title">MAHKOTA BINTANG</h1>
        <p class="start-subtitle">Petualangan RPG Bahasa Inggris Kelas 3 &amp; 4 SD</p>

        <div class="mission-brief">
          <strong>${icon(Icons.scroll(14, 14), "#f5a623")} Misi Kerajaan:</strong> Prajurit terpilih! Mahkota Bintang milik Putri Cahaya hilang dicuri monster di Hutan Rahasia. Jelajahi kerajaan, jawab pertanyaan bahasa Inggris dari warga, temukan kunci, dan kembalikan mahkota sebelum Festival dimulai!
        </div>

        <form id="registration-form" class="form-group" onsubmit="return false;">
          <label class="form-label" for="player-name-input">
            ${icon(Icons.user(14, 14), "#94a3b8")} Nama Prajurit:
          </label>
          <input
            type="text"
            id="player-name-input"
            class="form-input"
            placeholder="Ketik nama kamu di sini..."
            maxlength="20"
            autocomplete="off"
            required
          />
          <div id="name-error" class="error-text">${icon(Icons.alertTriangle(14, 14), "#f87171")} Masukkan nama minimal 2 karakter!</div>

          <label class="form-label" style="margin-top: 8px;">
            ${icon(Icons.bookOpen(14, 14), "#94a3b8")} Pilih Tingkat Kelas:
          </label>
          <div class="grade-options">
            <button type="button" class="grade-btn selected" data-grade="3" id="grade-btn-3">
              ${icon(Icons.package(16, 16))} Kelas 3 SD
            </button>
            <button type="button" class="grade-btn" data-grade="4" id="grade-btn-4">
              ${icon(Icons.bookOpen(16, 16))} Kelas 4 SD
            </button>
          </div>

          <button type="submit" id="btn-start-game" class="btn-primary" style="margin-top: 14px;">
            ${icon(Icons.sword(18, 18))} Mulai Petualangan!
          </button>
        </form>
      </div>
    `;
  }

  private bindEvents(): void {
    const form = this.container.querySelector(
      "#registration-form",
    ) as HTMLFormElement;
    const nameInput = this.container.querySelector(
      "#player-name-input",
    ) as HTMLInputElement;
    const nameError = this.container.querySelector(
      "#name-error",
    ) as HTMLElement;
    const grade3Btn = this.container.querySelector(
      "#grade-btn-3",
    ) as HTMLButtonElement;
    const grade4Btn = this.container.querySelector(
      "#grade-btn-4",
    ) as HTMLButtonElement;

    grade3Btn.addEventListener("click", () => {
      this.selectedGrade = "3";
      grade3Btn.classList.add("selected");
      grade4Btn.classList.remove("selected");
      AudioSystem.playInteract();
    });

    grade4Btn.addEventListener("click", () => {
      this.selectedGrade = "4";
      grade4Btn.classList.add("selected");
      grade3Btn.classList.remove("selected");
      AudioSystem.playInteract();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      if (name.length < 2) {
        nameError.style.display = "flex";
        nameInput.focus();
        return;
      }

      nameError.style.display = "none";
      GameState.initPlayer(name, this.selectedGrade);
      AudioSystem.playCorrect();
      this.hide();
      this.onStartCallback();
    });

    setTimeout(() => nameInput.focus(), 200);
  }

  public show(): void {
    this.container.classList.add("active");
    const nameInput = this.container.querySelector(
      "#player-name-input",
    ) as HTMLInputElement;
    if (nameInput) {
      nameInput.value = "";
      setTimeout(() => nameInput.focus(), 200);
    }
  }

  public hide(): void {
    this.container.classList.remove("active");
  }
}
