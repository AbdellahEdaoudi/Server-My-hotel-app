const CheckoutShema = require('../Models/CheckoutShema');

// GET /Checkout
exports.getAllCheckouts = async (req, res) => {
  try {
    const checkouts = await CheckoutShema.find();
    res.status(200).json(checkouts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching checkouts", error: error.message });
  }
};

// GET /Checkout/:id
exports.getCheckoutById = async (req, res) => {
  try {
    const checkout = await CheckoutShema.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }
    res.status(200).json(checkout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching checkout", error: error.message });
  }
};

// POST /Checkout
exports.createCheckout = async (req, res) => {
  try {
    const { nameC, email, nameR, amount, check_in, check_out } = req.body;
    const newCheckout = new CheckoutShema({ nameC, email, nameR, amount, check_in, check_out });
    const savedCheckout = await newCheckout.save();
    res.status(201).json(savedCheckout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating checkout", error: error.message });
  }
};

// PUT /Checkout/:id
exports.updateCheckoutById = async (req, res) => {
  try {
    const { nameC, email, nameR, amount, check_in, check_out } = req.body;
    const updatedCheckout = await CheckoutShema.findByIdAndUpdate(
      req.params.id,
      { nameC, email, nameR, amount, check_in, check_out },
      { new: true }
    );
    if (!updatedCheckout) {
      return res.status(404).json({ message: "Checkout not found" });
    }
    res.status(200).json(updatedCheckout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating checkout", error: error.message });
  }
};

// DELETE /Checkout/:id
exports.deleteCheckoutById = async (req, res) => {
  try {
    const deletedCheckout = await CheckoutShema.findByIdAndDelete(req.params.id);
    if (!deletedCheckout) {
      return res.status(404).json({ message: "Checkout not found" });
    }
    res.status(200).json(deletedCheckout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting checkout", error: error.message });
  }
};

// DELETE /Checkoutd
exports.deleteAllCheckouts = async (req, res) => {
  try {
    await CheckoutShema.deleteMany({});
    res.status(200).json({ message: "All documents deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting documents", error: error.message });
  }
};

// DELETE /CheckoutAll
exports.deleteSelectedCheckouts = async (req, res) => {
  try {
    const { Checkouts } = req.body;
    await CheckoutShema.deleteMany({ _id: { $in: Checkouts } });
    res.status(200).json({ message: "Selected documents deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting selected documents", error: error.message });
  }
};

// GET /Checkoutpay
exports.getCheckoutsByIds = async (req, res) => {
  try {
    const { Checkouts } = req.body;
    const result = await CheckoutShema.find({ _id: { $in: Checkouts } });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching checkouts", error: error.message });
  }
};

// POST /CheckoutDoc
exports.addMultipleCheckouts = async (req, res) => {
  try {
    const documents = req.body;
    const result = await CheckoutShema.insertMany(documents);
    res.status(201).json({ message: `${result.length} documents inserted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error inserting documents", error: error.message });
  }
};
