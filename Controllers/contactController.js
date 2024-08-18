const ContactSchema = require('../Models/ContactSchema');

// GET /Contact
exports.getContacts = async (req, res) => {
  try {
    const contacts = await ContactSchema.find();
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching contacts", error: error.message });
  }
};

// GET /Contact/:id
exports.getContactById = async (req, res) => {
  try {
    const contact = await ContactSchema.findById(req.params.id);
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
    const { name, email, subject, msg } = req.body;
    const existingContact = await ContactSchema.findOne({ name, email, subject, msg });
    if (existingContact) {
      return res.status(400).json({ error: 'Contact already exists' });
    }
    const newContact = new ContactSchema({ name, email, subject, msg });
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
