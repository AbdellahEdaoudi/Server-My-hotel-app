const ContactSchema = require('../Models/ContactSchema');

// GET /Contact
exports.getContacts = async (req, res) => {
  try {
    const contacts = await ContactSchema.find().populate('user', 'name email');
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching contacts", error: error.message });
  }
};

// GET /Contact/:id
exports.getContactById = async (req, res) => {
  try {
    const contact = await ContactSchema.findById(req.params.id).populate('user', 'name email');
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching contact", error: error.message });
  }
};

// POST /Contact
exports.createContact = async (req, res) => {
  try {
    const { user, subject, message } = req.body;
    // Check if duplicate contact exists (optional logic based on user/subject/message)
    const existingContact = await ContactSchema.findOne({ user, subject, message });
    if (existingContact) {
      return res.status(400).json({ error: 'Contact already exists' });
    }
    const newContact = new ContactSchema({ user, subject, message });
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// DELETE /Contact
exports.deleteAllContacts = async (req, res) => {
  try {
    await ContactSchema.deleteMany({});
    res.status(200).json({ message: "All documents deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting documents", error: error.message });
  }
};

// POST /ContactDoc (bulk insert)
exports.bulkInsertContacts = async (req, res) => {
  try {
    const documents = req.body;
    if (!Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }
    const result = await ContactSchema.insertMany(documents);
    res.status(201).json({ message: `${result.length} documents inserted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error inserting documents", error: error.message });
  }
};

// DELETE /Contact/:id
exports.deleteContactById = async (req, res) => {
  try {
    const deletedContact = await ContactSchema.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(deletedContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting contact", error: error.message });
  }
};

// GET /Contact/user (Get logged-in user's contacts)
exports.getUserContacts = async (req, res) => {
  try {
    const contacts = await ContactSchema.find({ user: req.user })
      .populate('user', 'name email')
      .sort({ createdAt: -1 }); // Most recent first
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching contacts", error: error.message });
  }
};

// DELETE /Contact/user/:id (Delete user's own contact)
exports.deleteUserContact = async (req, res) => {
  try {
    const contact = await ContactSchema.findOne({ _id: req.params.id, user: req.user });
    if (!contact) {
      return res.status(404).json({ message: "Contact not found or unauthorized" });
    }
    await ContactSchema.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting contact", error: error.message });
  }
};

// DELETE /Contact/user/all (Delete all user's contacts)
exports.deleteAllUserContacts = async (req, res) => {
  try {
    await ContactSchema.deleteMany({ user: req.user });
    res.status(200).json({ message: "All your contacts deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting contacts", error: error.message });
  }
};
