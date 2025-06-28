class Product {
  final String nama;
  final int harga;
  final String ukuran;

  Product({
    required this.nama,
    required this.harga,
    required this.ukuran,
  });

  // Mengonversi data dari Firestore menjadi objek Product
  factory Product.fromFirestore(Map<String, dynamic> data) {
    return Product(
      nama: data['nama'],
      harga: data['harga'],
      ukuran: data['ukuran'],
    );
  }
}
