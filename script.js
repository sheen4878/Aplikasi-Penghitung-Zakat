function triggerFadeIn(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
      el.classList.remove('fade-in');
      void el.offsetWidth;
      el.classList.add('fade-in');
    }
  }

  // Fungsi menyalin Nomor Rekening
  function copyRekening() {
    const noRekening = document.getElementById('noRekening').innerText;
    navigator.clipboard.writeText(noRekening).then(() => {
      const feedback = document.getElementById('copyFeedback');
      const btnCopy = document.getElementById('btnCopy');
      
      // Ubah warna tombol jadi hijau sejenak
      btnCopy.classList.remove('text-blue-700', 'bg-blue-100', 'hover:bg-blue-200');
      btnCopy.classList.add('text-emerald-700', 'bg-emerald-100');
      
      // Munculkan tulisan feedback
      feedback.classList.remove('hidden');
      triggerFadeIn('copyFeedback');
      
      // Kembalikan ke semula setelah 2 detik
      setTimeout(() => {
        feedback.classList.add('hidden');
        btnCopy.classList.remove('text-emerald-700', 'bg-emerald-100');
        btnCopy.classList.add('text-blue-700', 'bg-blue-100', 'hover:bg-blue-200');
      }, 2000);
    }).catch(err => {
      alert('Gagal menyalin nomor rekening.');
    });
  }

  // Fungsi menampilkan pilihan metode pembayaran
  function showPaymentMethods() {
    closeQRIS();
    closeTransfer();
    const modal = document.getElementById('paymentMethodModal');
    modal.classList.remove('hidden');
    triggerFadeIn('paymentMethodModal');
  }

  // Fungsi menyembunyikan pilihan metode
  function closePaymentMethods() {
    document.getElementById('paymentMethodModal').classList.add('hidden');
  }

  // Fungsi menampilkan QRIS
  function showQRIS() {
    closePaymentMethods();
    const modal = document.getElementById('qrisModal');
    modal.classList.remove('hidden');
    triggerFadeIn('qrisModal');
  }

  // Fungsi menyembunyikan QRIS
  function closeQRIS() {
    document.getElementById('qrisModal').classList.add('hidden');
  }

  // Fungsi menampilkan Transfer Bank
  function showTransfer() {
    closePaymentMethods();
    const modal = document.getElementById('transferModal');
    modal.classList.remove('hidden');
    triggerFadeIn('transferModal');
  }

  // Fungsi menyembunyikan Transfer Bank
  function closeTransfer() {
    document.getElementById('transferModal').classList.add('hidden');
  }

  function onInputRupiah(e) {
    let value = e.value.replace(/[^,\d]/g, '');
    let split = value.split(',');
    let sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    let ribuan = split[0].substr(sisa).match(/\d{3}/gi);
    
    if(ribuan){
      let separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }
    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    e.value = rupiah;
  }

  function parseRupiah(str) {
    if (!str) return 0;
    return parseFloat(str.replace(/\./g, '')) || 0;
  }

  function saveSettings() {
    const hBeras = document.getElementById('hargaBeras').value;
    const hEmas = document.getElementById('hargaEmas').value;
    const hPerak = document.getElementById('hargaPerak').value;
    localStorage.setItem('savedHargaBeras', hBeras);
    localStorage.setItem('savedHargaEmas', hEmas);
    localStorage.setItem('savedHargaPerak', hPerak);
  }

  window.onload = function() {
    const savedBeras = localStorage.getItem('savedHargaBeras');
    const savedEmas = localStorage.getItem('savedHargaEmas');
    const savedPerak = localStorage.getItem('savedHargaPerak');
    
    if (savedBeras) document.getElementById('hargaBeras').value = savedBeras;
    if (savedEmas) document.getElementById('hargaEmas').value = savedEmas;
    if (savedPerak) document.getElementById('hargaPerak').value = savedPerak;

    updateFormMaal();
  };

  function switchTab(tab) {
    const btnFitrah = document.getElementById('btnFitrah');
    const btnMal = document.getElementById('btnMal');
    const tabFitrah = document.getElementById('tabFitrah');
    const tabMal = document.getElementById('tabMal');

    if (tab === 'fitrah') {
      tabFitrah.classList.remove('hidden');
      tabMal.classList.add('hidden');
      btnFitrah.className = "w-1/2 py-2 px-4 text-center font-semibold text-emerald-600 border-b-2 border-emerald-600 focus:outline-none transition-all duration-300 hover:scale-105";
      btnMal.className = "w-1/2 py-2 px-4 text-center font-semibold text-gray-500 hover:text-emerald-600 focus:outline-none transition-all duration-300 hover:scale-105";
      triggerFadeIn('tabFitrah');
    } else {
      tabMal.classList.remove('hidden');
      tabFitrah.classList.add('hidden');
      btnMal.className = "w-1/2 py-2 px-4 text-center font-semibold text-emerald-600 border-b-2 border-emerald-600 focus:outline-none transition-all duration-300 hover:scale-105";
      btnFitrah.className = "w-1/2 py-2 px-4 text-center font-semibold text-gray-500 hover:text-emerald-600 focus:outline-none transition-all duration-300 hover:scale-105";
      triggerFadeIn('tabMal');
    }
  }

  function formatRupiahTampil(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  }

  function updateFormMaal() {
    const jenis = document.getElementById('jenisMaal').value;
    const subLogam = document.getElementById('subLogam').value;
    const inputStandar = document.getElementById('inputStandar');
    const inputPertanian = document.getElementById('inputPertanian');
    const wrapperSubLogam = document.getElementById('wrapperSubLogam');
    const wrapperHargaEmas = document.getElementById('wrapperHargaEmas');
    const wrapperHargaPerak = document.getElementById('wrapperHargaPerak');
    const wrapperJenisHewan = document.getElementById('wrapperJenisHewan');
    const labelHarta = document.getElementById('labelHarta');
    const hintHarta = document.getElementById('hintHarta');
    const inputHarta = document.getElementById('totalHarta');

    document.getElementById('hasilMal').classList.add('hidden');
    
    if (!event || event.target.id === 'jenisMaal') {
       inputHarta.value = ""; 
    }

    // Tampilkan pilihan sub-kategori logam jika zakat emasPerak dipilih
    if (jenis === 'emasPerak') {
        wrapperSubLogam.classList.remove('hidden');
        triggerFadeIn('wrapperSubLogam');
    } else {
        wrapperSubLogam.classList.add('hidden');
    }

    // Pengaturan visibilitas input harga dan jenis logam
    if (jenis === 'emasPerak') {
        if (subLogam === 'emas') {
            wrapperHargaEmas.classList.remove('hidden');
            wrapperHargaPerak.classList.add('hidden');
        } else {
            wrapperHargaEmas.classList.add('hidden');
            wrapperHargaPerak.classList.remove('hidden');
        }
    } else if (['perdagangan', 'simpanan', 'profesi'].includes(jenis)) {
        wrapperHargaEmas.classList.remove('hidden');
        wrapperHargaPerak.classList.add('hidden');
    } else {
        wrapperHargaEmas.classList.add('hidden');
        wrapperHargaPerak.classList.add('hidden');
    }

    if (jenis === 'peternakan') {
        wrapperJenisHewan.classList.remove('hidden');
        triggerFadeIn('wrapperJenisHewan');
    } else {
        wrapperJenisHewan.classList.add('hidden');
    }

    if (jenis === 'pertanian') {
      inputStandar.classList.add('hidden');
      inputPertanian.classList.remove('hidden');
      triggerFadeIn('inputPertanian');
    } else {
      inputStandar.classList.remove('hidden');
      inputPertanian.classList.add('hidden');
      triggerFadeIn('inputStandar');

      if (jenis === 'emasPerak') {
        if (subLogam === 'emas') {
          labelHarta.innerText = "Total Berat Emas Yang Dimiliki (Gram)";
          hintHarta.innerText = "*Telah mencapai haul 1 tahun (Nisab 85 gram)";
          inputHarta.placeholder = "Contoh: 100";
        } else {
          labelHarta.innerText = "Total Berat Perak Yang Dimiliki (Gram)";
          hintHarta.innerText = "*Telah mencapai haul 1 tahun (Nisab 595 gram)";
          inputHarta.placeholder = "Contoh: 600";
        }
        inputHarta.type = 'number';
        inputHarta.setAttribute('onkeyup', '');
      } else if (jenis === 'peternakan') {
        const jenisHewan = document.getElementById('jenisHewan').value;
        labelHarta.innerText = `Total Jumlah ${jenisHewan.charAt(0).toUpperCase() + jenisHewan.slice(1)} (Ekor)`;
        hintHarta.innerText = "*Telah mencapai haul 1 tahun hijriah";
        inputHarta.type = 'number';
        inputHarta.setAttribute('onkeyup', '');
        inputHarta.placeholder = jenisHewan === 'sapi' ? "Contoh: 40" : "Contoh: 150";
      } else if (jenis === 'temuan') {
        labelHarta.innerText = "Total Harta Temuan (Rp)";
        hintHarta.innerText = "*Kadar zakat 20% tanpa Nisab dan Haul, dikeluarkan saat ditemukan";
        inputHarta.type = 'text';
        inputHarta.setAttribute('onkeyup', 'onInputRupiah(this)');
        inputHarta.placeholder = "Contoh: 10.000.000";
      } else if (jenis === 'tambang') {
        labelHarta.innerText = "Nilai Hasil Tambang Diuangkan (Rp)";
        hintHarta.innerText = "*Nisab adalah hasil tambang itu sendiri. Dikeluarkan setiap mengambil hasilnya (10%)";
        inputHarta.type = 'text';
        inputHarta.setAttribute('onkeyup', 'onInputRupiah(this)');
        inputHarta.placeholder = "Contoh: 50.000.000";
      } else {
        inputHarta.type = 'text';
        inputHarta.setAttribute('onkeyup', 'onInputRupiah(this)');
        inputHarta.placeholder = "Contoh: 10.000.000";

        if (jenis === 'profesi') {
          labelHarta.innerText = "Total Penghasilan Kotor (Rp)";
          hintHarta.innerText = "*Khusus profesi yang bersertifikasi. Pendapatan kotor dalam satu bulan";
        } else if (jenis === 'perdagangan') {
          labelHarta.innerText = "Modal + Keuntungan Bersih (Rp)";
          hintHarta.innerText = "*Telah mencapai haul 1 tahun";
        } else if (jenis === 'simpanan') {
          labelHarta.innerText = "Saldo Akhir Tahun (Rp)";
          hintHarta.innerText = "";
        }
      }
    }
  }

  function hitungFitrah() {
    const jiwa = parseFloat(document.getElementById('jumlahJiwa').value) || 0;
    const hargaBerasManual = parseRupiah(document.getElementById('hargaBeras').value); 
    
    if (jiwa <= 0 || hargaBerasManual <= 0) return alert("Mohon masukkan data yang valid.");

    const berasKg = jiwa * 2.7; 
    const totalUang = berasKg * hargaBerasManual;

    document.getElementById('resBerasKg').innerText = berasKg.toFixed(1) + " Kg Beras";
    document.getElementById('resBerasRp').innerText = formatRupiahTampil(totalUang);
    document.getElementById('hasilFitrah').classList.remove('hidden');
    triggerFadeIn('hasilFitrah');
  }

  function hitungMal() {
    const jenis = document.getElementById('jenisMaal').value;
    const subLogam = document.getElementById('subLogam').value;
    const hargaEmas = parseRupiah(document.getElementById('hargaEmas').value);
    const hargaPerak = parseRupiah(document.getElementById('hargaPerak').value);
    
    if (jenis === 'emasPerak') {
      if (subLogam === 'emas' && hargaEmas <= 0) return alert("Mohon masukkan harga emas saat ini.");
      if (subLogam === 'perak' && hargaPerak <= 0) return alert("Mohon masukkan harga perak saat ini.");
    } else if (['perdagangan', 'simpanan', 'profesi'].includes(jenis) && hargaEmas <= 0) {
      return alert("Mohon masukkan harga emas saat ini.");
    }

    const statusNisab = document.getElementById('statusNisab');
    const resMalRp = document.getElementById('resMalRp');
    const detailNisabInfo = document.getElementById('detailNisab');
    const btnBayarMal = document.getElementById('btnBayarMal'); // Mengambil id tombol

    let nisab = 0;
    let kadar = 0.025;
    let totalNilai = 0;
    let wajibZakat = false;
    let zakatWajib = 0;

    if (jenis === 'peternakan') {
        const jenisHewan = document.getElementById('jenisHewan').value;
        const jumlah = parseFloat(document.getElementById('totalHarta').value) || 0;
        
        if (jenisHewan === 'sapi') {
            if (jumlah >= 30) {
                wajibZakat = true;
                let best30 = 0, best40 = 0, minRemainder = jumlah;
                
                for (let i = 0; i * 30 <= jumlah; i++) {
                    let rem = jumlah - (i * 30);
                    let j = Math.floor(rem / 40);
                    let finalRem = rem % 40;
                    if (finalRem < minRemainder) {
                        minRemainder = finalRem;
                        best30 = i;
                        best40 = j;
                    }
                }
                
                let teksHasil = [];
                if (best30 > 0) teksHasil.push(best30 + " Ekor Sapi Jantan/Betina (Usia 1-2 Thn)");
                if (best40 > 0) teksHasil.push(best40 + " Ekor Sapi Betina (Usia 2-3 Thn)");
                
                statusNisab.innerText = "Wajib Membayar Zakat Sapi:";
                statusNisab.className = "text-sm font-semibold text-emerald-800";
                resMalRp.innerText = teksHasil.join(" & ");
                resMalRp.className = "text-2xl font-extrabold text-emerald-700 my-1 font-poppins";
                detailNisabInfo.innerText = "Telah mencapai nisab (Minimal 30 Ekor Sapi)";
                btnBayarMal.classList.remove('hidden'); // Munculkan tombol
            } else {
                statusNisab.innerText = "Belum Wajib Zakat (Belum Mencapai Nisab 30 Ekor)";
                statusNisab.className = "text-sm font-semibold text-amber-700";
                resMalRp.innerText = "0 Ekor";
                resMalRp.className = "text-3xl font-extrabold text-amber-600 my-1 font-poppins";
                detailNisabInfo.innerText = "";
                btnBayarMal.classList.add('hidden'); // Sembunyikan tombol
            }
        } 
        else if (jenisHewan === 'kambing') {
            if (jumlah >= 40) {
                wajibZakat = true;
                let zakatEkor = 0;
                if (jumlah >= 40 && jumlah <= 120) zakatEkor = 1;
                else if (jumlah >= 121 && jumlah <= 200) zakatEkor = 2;
                else {
                    zakatEkor = Math.floor((jumlah - 1) / 100) + 1;
                }
                
                statusNisab.innerText = "Wajib Membayar Zakat Kambing:";
                statusNisab.className = "text-sm font-semibold text-emerald-800";
                resMalRp.innerText = zakatEkor + " Ekor Kambing (Usia 2 Thn)";
                resMalRp.className = "text-2xl font-extrabold text-emerald-700 my-1 font-poppins";
                detailNisabInfo.innerText = "Telah mencapai nisab (Minimal 40 Ekor Kambing)";
                btnBayarMal.classList.remove('hidden'); // Munculkan tombol
            } else {
                statusNisab.innerText = "Belum Wajib Zakat (Belum Mencapai Nisab 40 Ekor)";
                statusNisab.className = "text-sm font-semibold text-amber-700";
                resMalRp.innerText = "0 Ekor";
                resMalRp.className = "text-3xl font-extrabold text-amber-600 my-1 font-poppins";
                detailNisabInfo.innerText = "";
                btnBayarMal.classList.add('hidden'); // Sembunyikan tombol
            }
        }
        
        document.getElementById('hasilMal').classList.remove('hidden');
        triggerFadeIn('hasilMal');
        return; 
    }

    if (jenis === 'pertanian') {
      const nilaiPanen = parseRupiah(document.getElementById('nilaiPanen').value);
      const hargaGabah = parseRupiah(document.getElementById('hargaGabah').value);
      const pengairan = parseFloat(document.getElementById('pengairan').value);
      
      if (hargaGabah <= 0) return alert("Mohon masukkan harga gabah.");

      nisab = 653 * hargaGabah; 
      kadar = pengairan;
      totalNilai = nilaiPanen;

      detailNisabInfo.innerText = `Nisab (Setara 653 kg gabah) = ${formatRupiahTampil(nisab)}`;

      if (totalNilai >= nisab) {
        wajibZakat = true;
        zakatWajib = totalNilai * kadar;
      }
    } else if (jenis === 'temuan') {
      totalNilai = parseRupiah(document.getElementById('totalHarta').value);
      if (totalNilai > 0) {
          wajibZakat = true;
          zakatWajib = totalNilai * 0.20;
          detailNisabInfo.innerText = "Dikeluarkan saat ditemukan (Tanpa syarat Nisab & Haul)";
      }
    } else if (jenis === 'tambang') {
      totalNilai = parseRupiah(document.getElementById('totalHarta').value);
      if (totalNilai > 0) {
          wajibZakat = true;
          zakatWajib = totalNilai * 0.10;
          detailNisabInfo.innerText = "Nisab: Hasil tambang itu sendiri | Haul: Saat ditambang";
      }
    } else if (jenis === 'emasPerak') {
      const totalGram = parseFloat(document.getElementById('totalHarta').value) || 0;
      if (subLogam === 'emas') {
        nisab = 85; 
        detailNisabInfo.innerText = `Nisab Emas (Setara 85 gram)`;
        if (totalGram >= nisab) {
          wajibZakat = true;
          zakatWajib = (totalGram * kadar) * hargaEmas; 
        }
      } else {
        nisab = 595; 
        detailNisabInfo.innerText = `Nisab Perak (Setara 595 gram)`;
        if (totalGram >= nisab) {
          wajibZakat = true;
          zakatWajib = (totalGram * kadar) * hargaPerak; 
        }
      }
    } else {
      totalNilai = parseRupiah(document.getElementById('totalHarta').value);
      
      if (jenis === 'profesi') {
        nisab = 7.1 * hargaEmas;
        detailNisabInfo.innerText = `Nisab (Setara 7,1 gram emas) = ${formatRupiahTampil(nisab)}`;
      } else {
        nisab = 85 * hargaEmas;
        detailNisabInfo.innerText = `Nisab (Setara 85 gram emas) = ${formatRupiahTampil(nisab)}`;
      }

      if (totalNilai >= nisab) {
        wajibZakat = true;
        zakatWajib = totalNilai * kadar;
      }
    }

    // Logika umum kemunculan tombol Bayar Zakat
    if (wajibZakat) {
      statusNisab.innerText = "Wajib Membayar Zakat Maal:";
      statusNisab.className = "text-sm font-semibold text-emerald-800";
      resMalRp.innerText = formatRupiahTampil(zakatWajib);
      resMalRp.className = "text-3xl font-extrabold text-emerald-700 my-1 font-poppins";
      btnBayarMal.classList.remove('hidden'); // Munculkan tombol
    } else {
      statusNisab.innerText = "Belum Wajib Zakat (Belum Mencapai Nisab)";
      statusNisab.className = "text-sm font-semibold text-amber-700";
      resMalRp.innerText = "Rp 0";
      resMalRp.className = "text-3xl font-extrabold text-amber-600 my-1 font-poppins";
      btnBayarMal.classList.add('hidden'); // Sembunyikan tombol
    }

    document.getElementById('hasilMal').classList.remove('hidden');
    triggerFadeIn('hasilMal');
  }

  function resetForm() {
    document.getElementById('jumlahJiwa').value = "1";
    document.getElementById('totalHarta').value = "";
    document.getElementById('nilaiPanen').value = "";
    document.getElementById('hargaGabah').value = "";
    document.getElementById('hasilFitrah').classList.add('hidden');
    document.getElementById('hasilMal').classList.add('hidden');
  }