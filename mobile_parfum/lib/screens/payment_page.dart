import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class PaymentPage extends StatefulWidget {
  final String productName;
  final int productPrice;
  final String productId;
  final String productSize; // NEW
  
  PaymentPage({
    required this.productName,
    required this.productPrice,
    required this.productId,  
    required this.productSize,
  });

  @override
  _PaymentPageState createState() => _PaymentPageState();
}

class _PaymentPageState extends State<PaymentPage> {
  String? selectedPaymentMethod;
  TextEditingController addressController = TextEditingController();

  void _openWhatsApp() async {
    final phoneNumber = '+6287725819811';
    final message =
        'Halo, saya ingin mengonfirmasi pembayaran untuk produk ${widget.productName} sebesar Rp ${widget.productPrice}. Alamat pengiriman: ${addressController.text}';
    final url = 'https://wa.me/$phoneNumber?text=${Uri.encodeComponent(message)}';

    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Tidak dapat membuka WhatsApp';
    }
  }

  Future<void> _saveOrderToFirestore() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return;

    await FirebaseFirestore.instance.collection('orders').add({
      'userId': user.uid,
      'productName': widget.productName,
      'price': widget.productPrice,
      'address': addressController.text.trim(),
      'paymentMethod': selectedPaymentMethod,
      'status': 'Pesanan diterima',
      'timestamp': Timestamp.now(),
    });
  }

  Future<void> _decreaseProductStock() async {
    final docRef = FirebaseFirestore.instance.collection('products').doc(widget.productId);
    final docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      final currentStock = docSnapshot['stock'] ?? 0;
      if (currentStock > 0) {
        await docRef.update({'stock': currentStock - 1});
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Pembayaran", style: TextStyle(color: Colors.white)),
        backgroundColor: Color(0xFF660000),
        elevation: 5,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.vertical(bottom: Radius.circular(30))),
      ),
      body: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(15),
                boxShadow: [BoxShadow(color: Colors.grey.withOpacity(0.2), spreadRadius: 2, blurRadius: 10)],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Alamat Pengiriman', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                  SizedBox(height: 10),
                  TextField(
                    controller: addressController,
                    decoration: InputDecoration(labelText: 'Masukkan alamat lengkap', border: OutlineInputBorder()),
                  ),
                ],
              ),
            ),
            SizedBox(height: 20),
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(15),
                boxShadow: [BoxShadow(color: Colors.grey.withOpacity(0.2), spreadRadius: 2, blurRadius: 10)],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Produk: ${widget.productName}', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500)),
                  SizedBox(height: 10),
                  Text('Harga: Rp ${widget.productPrice}', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF660000))),
                ],
              ),
            ),
            SizedBox(height: 20),
            Text('Pilih Metode Pembayaran:', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            RadioListTile<String>(
              title: Text('COD (Cash on Delivery)'),
              value: 'COD',
              groupValue: selectedPaymentMethod,
              onChanged: (val) => setState(() => selectedPaymentMethod = val),
            ),
            RadioListTile<String>(
              title: Text('Transfer via Bank (BNI 1797086267)'),
              value: 'Transfer',
              groupValue: selectedPaymentMethod,
              onChanged: (val) => setState(() => selectedPaymentMethod = val),
            ),
            if (selectedPaymentMethod == 'Transfer')
              Center(
                child: ElevatedButton(
                  onPressed: _openWhatsApp,
                  child: Text('Konfirmasi Pembayaran via WhatsApp', style: TextStyle(color: Colors.white),),
                  style: ElevatedButton.styleFrom(backgroundColor: Color(0xFF660000), padding: EdgeInsets.symmetric(horizontal: 40, vertical: 12)),
                ),
              ),
            SizedBox(height: 20),
            Center(
              child: ElevatedButton(
                onPressed: () async {
                  if (selectedPaymentMethod == null) {
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Pilih metode pembayaran terlebih dahulu')));
                    return;
                  }
                  if (addressController.text.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Alamat tidak boleh kosong')));
                    return;
                  }

                  await _saveOrderToFirestore();
                  await _decreaseProductStock();

                  final order = {
                    'product': widget.productName,
                    'price': widget.productPrice.toString(),
                    'status': 'Pesanan diterima',
                  };
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Pembayaran Berhasil')));
                  Navigator.pop(context, order);
                },
                child: Text('Lanjutkan Pembayaran', style: TextStyle(color: Colors.white),),
                style: ElevatedButton.styleFrom(backgroundColor: Color(0xFF660000), padding: EdgeInsets.symmetric(horizontal: 40, vertical: 12)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
