import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'payment_page.dart';

class DetailItemScreen extends StatefulWidget {
  final String productName;
  final String productDescription;
  final String productImage;
  final int productPrice;
  final Map<String, int> productSizes;
  final int productStock;
  final String productId;

  DetailItemScreen({
    required this.productName,
    required this.productDescription,
    required this.productImage,
    required this.productPrice,
    required this.productSizes,
    required this.productStock,
    required this.productId,
  });

  @override
  _DetailItemScreenState createState() => _DetailItemScreenState();
}

class _DetailItemScreenState extends State<DetailItemScreen> {
  String? selectedSize;
  int? finalPrice;

  Future<void> addToCart() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null || selectedSize == null) return;

    await FirebaseFirestore.instance.collection('cart').add({
      'userId': user.uid,
      'productId': widget.productId,
      'productName': widget.productName,
      'productImage': widget.productImage,
      'size': selectedSize,
      'price': finalPrice,
      'quantity': 1,
      'timestamp': Timestamp.now(),
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Produk ditambahkan ke keranjang')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Detail ${widget.productName}', style: TextStyle(color: Colors.black)),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(30),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 250,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: AssetImage(widget.productImage),
                  fit: BoxFit.cover,
                ),
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            SizedBox(height: 20),
            Text(widget.productName, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            SizedBox(height: 5),
            Text('Stok tersedia: ${widget.productStock}', style: TextStyle(color: Colors.green, fontSize: 16)),
            SizedBox(height: 5),
            Row(
              children: [
                Icon(Icons.star, color: Colors.orange, size: 18),
                Text('4.8 (230)', style: TextStyle(color: Colors.grey, fontSize: 16)),
              ],
            ),
            SizedBox(height: 10),
            Divider(color: Colors.grey, thickness: 1),
            SizedBox(height: 10),
            Text('Deskripsi Produk', style: TextStyle(fontWeight: FontWeight.bold)),
            SizedBox(height: 10),
            Text(widget.productDescription, style: TextStyle(color: Colors.grey)),
            SizedBox(height: 20),
            Text('Pilih Ukuran:', style: TextStyle(fontWeight: FontWeight.bold)),
            SizedBox(height: 10),
            Wrap(
              spacing: 10,
              children: widget.productSizes.keys.map((size) {
                return ChoiceChip(
                  label: Text(size),
                  selected: selectedSize == size,
                  onSelected: (selected) {
                    setState(() {
                      selectedSize = size;
                      finalPrice = widget.productSizes[size];
                    });
                  },
                );
              }).toList(),
            ),
            SizedBox(height: 20),
            if (selectedSize != null)
              Text('Harga: Rp $finalPrice', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red[900])),
            SizedBox(height: 30),
            ElevatedButton(
              onPressed: selectedSize == null
                  ? null
                  : () async {
                      final result = await Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => PaymentPage(
                            productName: widget.productName,
                            productPrice: finalPrice ?? 0,
                            productSize: selectedSize!,
                            productId: widget.productId,
                          ),
                        ),
                      );

                      if (result != null && result is Map<String, String>) {
                        Navigator.pop(context, result);
                      }
                    },
              child: Text('Lanjutkan Pembayaran', style: TextStyle(color: Colors.white),),
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF660000),
                minimumSize: Size(double.infinity, 50)),
            ),
            SizedBox(height: 10),
            ElevatedButton(
              onPressed: selectedSize == null ? null : addToCart,
              child: Text('Tambah ke Keranjang', style: TextStyle(color: Colors.white),),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orange[700],
                minimumSize: Size(double.infinity, 50),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
