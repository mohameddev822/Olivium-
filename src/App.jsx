import React, { useState, useEffect } from "react";
import { IotaClient } from "@iota/iota-sdk/client";
import { Transaction } from "@iota/iota-sdk/transactions";
import { Ed25519Keypair } from "@iota/iota-sdk/keypairs/ed25519";
import { decodeIotaPrivateKey } from "@iota/iota-sdk/cryptography";
import QRCode from "react-qr-code";
const recipientAddress = "0xb403005d6c610fdcc33d241fa1efcc462f5a7677f17310d7fa48a2d3bd6d1815";
const gasBudget = 10000000000;
const packageId = "0x051c85b06a990e47fac2824422d03b02e3ee6df20ecab3e10c68192b04c32957";
const secretKey = "iotaprivkey1qrpa6z2dqjdn7kyfhutahuar2ak8sgwdyl7uthe4tna3unv4k7ctj2y277v";
const parsedKeypair = decodeIotaPrivateKey(secretKey);
const keypair = Ed25519Keypair.fromSecretKey(parsedKeypair.secretKey);
const client = new IotaClient({ url: "http://127.0.0.1:9000" });

// Storage helper functions
const memoryStorage = {};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to storage:", error);
  }
}

const loadFromStorage = (key, defaultValue = null) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error("Error loading from storage:", error);
    return defaultValue;
  }
};
// Role authentication credentials
const ROLE_CREDENTIALS = {
  farmer: { password: "farmer123" },
  harvester: { password: "harvester123" },
  processor: { password: "processor123" },
  packager: { password: "packager123" },
  "quality controller": { password: "qc123" },
  distributor: { password: "distributor123" },
  retailer: { password: "retailer123" },
  customer: { password: "customer123" }
};

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => 
    loadFromStorage('olivium_isAuthenticated', false)
  );
    const [password, setPassword] = useState("");
const [organizationDatabase, setOrganizationDatabase] = useState(() => {
  const stored = loadFromStorage('olivium_organizationDatabase', {});
  console.log('Loaded organization database from storage:', stored);
  return stored;
});
useEffect(() => {
  saveToStorage('olivium_organizationDatabase', organizationDatabase);
}, [organizationDatabase]);


  const [authRole, setAuthRole] = useState(() => 
    loadFromStorage('olivium_authRole', '')
  );
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
 const [numericPattern, setNumericPattern] = useState(() => 
  loadFromStorage('olivium_numericPattern', '')
);
useEffect(() => {
  saveToStorage('olivium_numericPattern', numericPattern);
}, [numericPattern]);
  // Wallet connection state
  const [isWalletConnected, setIsWalletConnected] = useState(() => 
    loadFromStorage('olivium_isWalletConnected', false)
  );
  const [walletKeypair, setWalletKeypair] = useState(null);
  const [walletAddress, setWalletAddress] = useState(() => 
    loadFromStorage('olivium_walletAddress', '')
  );
  const [privateKey, setPrivateKey] = useState("");
  const [walletBalance, setWalletBalance] = useState(0n);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState("");
 const [totalBlocks, setTotalBlocks] = useState(null);
const [passwordauthentication , setpasswordauthentication] = useState("");
  // Role selection
  const [selectedRole, setSelectedRole] = useState(() => 
    loadFromStorage('olivium_selectedRole', 'farmer')
  );

  // Gas payment object state
  const [gasPaymentObject, setGasPaymentObject] = useState(null);
  const [gasObjectLoading, setGasObjectLoading] = useState(false);
  const [gasObjectError, setGasObjectError] = useState("No gas found");
  const [authenticatedorganization , setorganization] = useState(false);
  // Dashboard state
  const [oliveGroveDetails, setOliveGroveDetails] = useState(() => 
    loadFromStorage('olivium_oliveGroveDetails', true)
  );
  const [registerData, setRegisterData] = useState(() => 
    loadFromStorage('olivium_registerData', false)
  );
  const [orgName, setOrgName] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(() => {
    const stored = loadFromStorage('olivium_selectedBatch', null);
    return stored;
  });
  const [selectedSection, setSelectedSection] = useState(() => 
    loadFromStorage('olivium_selectedSection', 'Cultivation')
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Store actual blockchain object IDs for each batch
  const [batchObjectIds, setBatchObjectIds] = useState(() => 
    loadFromStorage('olivium_batchObjectIds', {})
  );

  

  // Store production costs for each batch
  const [productionCosts, setProductionCosts] = useState(() => 
    loadFromStorage('olivium_productionCosts', {})
  );

  // Store olive quantity for each batch
  const [oliveQuantities, setOliveQuantities] = useState(() =>
    loadFromStorage('olivium_oliveQuantities', {})
  );
  

  const batches = [{ id: "Batch-001" }, { id: "Batch-002" }, { id: "Batch-003" }];

  // Fields by role
  const fieldsByRole = {
    farmer: [
      "latitude_microdeg",
      "longitude_microdeg", 
      "olive_variety_code",
      "planting_year",
      "soil_ph",
      "soil_moisture_percent",
      "soil_ec",
      "fertilizer_date",
      "fertilizer_type",
      "fertilizer_amount",
      "irrigation_type",
      "irrigation_amount",
      "rainfall",
      "temperature_celsius",
      "humidity_percent",
      "pest_control_date",
      "pest_control_type",
      "labor_worker_id",
      "labor_hours_worked",
      "cost_per_hectare_mad",
      "olive_quantity_kg"
    ],
    harvester: [
      "harvest_date", 
      "vehicle_id", 
      "labor_worker_id", 
      "labor_hours_worked",
      "harvesting_cost_mad",
      "harvested_quantity_kg"
    ],
    processor: [
      "press_method", 
      "temperature_celsius", 
      "labor_worker_id", 
      "labor_hours_worked",
      "processing_cost_mad",
      "oil_yield_liters"
    ],
    packager: [
      "seal_status", 
      "packaging_date", 
      "labor_worker_id",
      "packaging_cost_mad",
      "bottles_produced"
    ],
    "quality controller": [
      "qc_passed", 
      "qc_date", 
      "qc_inspector_id",
      "qc_cost_mad"
    ],
    distributor: [
      "distributor_location", 
      "distributor_shipment_id", 
      "distributor_date",
      "shipping_cost_mad"
    ],
    retailer: [
      "shelf_position", 
      "retailer_arrival_date", 
      "retailer_feedback_score",
      "retail_markup_percent",
      "price_per_bottle_mad"
    ],
    customer: [],
  };

  // Sections and their keys
  const sectionKeys = {
    Cultivation: fieldsByRole.farmer,
    Harvesting: fieldsByRole.harvester,
    Processing: fieldsByRole.processor,
    Packaging: fieldsByRole.packager,
    "Quality Control": fieldsByRole["quality controller"],
    Distributor: fieldsByRole.distributor,
    Retailer: fieldsByRole.retailer,
  };

  // Store blockchain data by batch + section
  const [blockchainData, setBlockchainData] = useState(() => 
    loadFromStorage('olivium_blockchainData', {})
  );

const [networkDetails, setNetworkDetails] = useState(false);

const [datasubmitted, setDatasubmitted] = useState(false);

  // Form data
  const [formData, setFormData] = useState(() => 
    loadFromStorage('olivium_formData', {})
  );

  // Store object IDs for different data types per batch
  const [batchRelatedObjects, setBatchRelatedObjects] = useState(() => 
    loadFromStorage('olivium_batchRelatedObjects', {})
  );
  function addRoleToOrganizationFixed(orgName, role, db) {
  const normalized = orgName.toLowerCase().trim();

  if (!db[normalized]) {
    db[normalized] = { pattern: Math.floor(100 + Math.random() * 900), roles: [] };
  }

  if (!db[normalized].roles.includes(role)) {
    db[normalized].roles.push(role);
  }
}
  function getOrganizationPatternFixed(orgName, db) {
  const normalized = orgName.toLowerCase().trim();

  // Reuse existing pattern if found
  if (db[normalized]?.pattern) {
    return db[normalized].pattern;
  }

  // Create new pattern if not found
  const newPattern = Math.floor(100 + Math.random() * 900); // 3-digit
  db[normalized] = { ...(db[normalized] || {}), pattern: newPattern, roles: [] };
  return newPattern;
}

const generatePassword = () => {
  if (!orgName.trim()) {
    alert("Please enter your organization name");
    return;
  }

  if (!authRole) {
    alert("Please select your role");
    return;
  }

  const normalizedOrgName = orgName.toLowerCase().trim();

  // Load the database from localStorage
  const currentOrgDatabase = loadFromStorage('olivium_organizationDatabase', {});

  // If organization already has a pattern, reuse it; otherwise generate a new one
  let organizationPattern;
  if (currentOrgDatabase[normalizedOrgName]?.pattern) {
   organizationPattern = getOrganizationPatternFixed(orgName, currentOrgDatabase);

  } else {
    organizationPattern = Math.floor(100 + Math.random() * 900); // 3-digit pattern
    currentOrgDatabase[normalizedOrgName] = {
      pattern: organizationPattern,
      roles: []
    };
  }

  // Add role if not already there
  if (!currentOrgDatabase[normalizedOrgName].roles.includes(authRole)) {
    currentOrgDatabase[normalizedOrgName].roles.push(authRole);
  }

  addRoleToOrganizationFixed(orgName, authRole, currentOrgDatabase);
          
  saveToStorage('olivium_organizationDatabase', currentOrgDatabase);

  // Random part for the password
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  setNumericPattern(String(organizationPattern));
  setPassword(authRole + orgName + randomPart + organizationPattern);

  console.log(
    currentOrgDatabase[normalizedOrgName].roles.length > 1
      ? `Existing organization "${orgName}" uses pattern: ${organizationPattern}`
      : `New organization "${orgName}" registered with pattern: ${organizationPattern}`
  );
};


const isDataFromSameOrganization = (sectionData) => {
  // If no organization pattern is set (user hasn't generated one), show all data
  if (!numericPattern) {
    return false;
  }
  
  // If the section data doesn't have an organization pattern, show it (legacy data)
  if (!sectionData.organization_pattern || sectionData.organization_pattern === "unknown") {
    return false;
  }
  
  // Check if the data's organization pattern matches the current user's pattern
  return sectionData.organization_pattern === numericPattern;
};

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthRole("");
    setAuthPassword("");
    setAuthError("");
    disconnectWallet();
    
    // Clear storage
    delete memoryStorage['olivium_isAuthenticated'];
    delete memoryStorage['olivium_authRole'];
  };

  // Wallet connection functions
  const generateNewWallet = async () => {
    setWalletLoading(true);
    setWalletError("");
    
    try {
      // Generate a new keypair
      const keypair = new Ed25519Keypair();
      const address = keypair.getPublicKey().toIotaAddress();
      const privateKey = keypair.getSecretKey().toString();
      
      // Set wallet state and private key
      setWalletKeypair(keypair);
      setWalletAddress(address);
      setPrivateKey(privateKey);
      setIsWalletConnected(true);
      
      // Try to get balance
      await updateWalletBalance(address);
      
      // Try to find gas objects
      await findGasObjects(address);
      
    } catch (error) {
      console.error("Error generating wallet:", error);
      setWalletError(`Failed to generate wallet: ${error.message}`);
    } finally {
      setWalletLoading(false);
    }
  };

  const connectExistingWallet = async (privateKeyInput) => {
    setWalletLoading(true);
    setWalletError("");
    
    try {
      // Parse the private key
      const parsedKeypair = decodeIotaPrivateKey(privateKeyInput);
      const keypair = Ed25519Keypair.fromSecretKey(parsedKeypair.secretKey);
      const address = keypair.getPublicKey().toIotaAddress();
      
      // Set wallet state
      setWalletKeypair(keypair);
      setWalletAddress(address);
      setPrivateKey(privateKeyInput);
      setIsWalletConnected(true);
      
      // Try to get balance
      await updateWalletBalance(address);
      
      // Try to find gas objects
      await findGasObjects(address);
        

    } catch (error) {
      console.error("Error connecting wallet:", error);
      setWalletError(`Failed to connect wallet: ${error.message}`);
    } finally {
      setWalletLoading(false);
    }
  };

  const updateWalletBalance = async (address) => {
    try {
      const balance = await client.getBalance({ owner: address });
      const totalBalance = balance.totalBalance || 0n;
      setWalletBalance(BigInt(totalBalance));
    } catch (error) {
      console.error("Error fetching balance:", error);
      setWalletBalance(0n);
    }
  };

  const findGasObjects = async (address) => {
    setGasObjectLoading(true);
    setGasObjectError("");
    
    try {
      const ownedObjects = await client.getOwnedObjects({
        owner: address,
        filter: {
          StructType: "0x2::coin::Coin<0x2::iota::IOTA>"
        },
        options: {
          showContent: true,
          showType: true,
        }
      });

      if (!ownedObjects.data || ownedObjects.data.length === 0) {
        throw new Error("No gas objects found. You may need to fund this wallet with IOTA tokens.");
      }

      const suitableGasObject = ownedObjects.data
        .filter(obj => obj.data?.content?.fields?.balance)
        .sort((a, b) => {
          const balanceA = BigInt(a.data.content.fields.balance);
          const balanceB = BigInt(b.data.content.fields.balance);
          return balanceB > balanceA ? 1 : -1;
        })[0];

      if (!suitableGasObject) {
        throw new Error("No suitable gas object found");
      }

      const dynamicGasPaymentObject = {
        objectId: suitableGasObject.data.objectId,
        version: suitableGasObject.data.version,
        digest: suitableGasObject.data.digest,
        amount: BigInt(suitableGasObject.data.content.fields.balance),
      };

      setGasPaymentObject(dynamicGasPaymentObject);
      
    } catch (error) {
      console.error("Error finding gas objects:", error);
      setGasObjectError(`No gas found: ${error.message}`);
    } finally {
      setGasObjectLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletKeypair(null);
    setWalletAddress("");
    setPrivateKey("");
    setWalletBalance(0n);
    setGasPaymentObject(null);
    setWalletError("");
    setGasObjectError("");
    
    // Clear storage
    delete memoryStorage['olivium_isWalletConnected'];
    delete memoryStorage['olivium_walletAddress'];
    delete memoryStorage['olivium_selectedRole'];
  };

  // Calculate total production cost for a batch
  const calculateProductionCost = (batchId) => {
    if (!blockchainData[batchId]) return 0;

    let totalCost = 0;

    // Farmer costs
    if (blockchainData[batchId].Cultivation?.cost_per_hectare_mad) {
      totalCost += Number(blockchainData[batchId].Cultivation.cost_per_hectare_mad) / 100;
    }

    // Harvester costs
    if (blockchainData[batchId].Harvesting?.harvesting_cost_mad) {
      totalCost += Number(blockchainData[batchId].Harvesting.harvesting_cost_mad) / 100;
    }

    // Processor costs
    if (blockchainData[batchId].Processing?.processing_cost_mad) {
      totalCost += Number(blockchainData[batchId].Processing.processing_cost_mad) / 100;
    }

    // Packager costs
    if (blockchainData[batchId].Packaging?.packaging_cost_mad) {
      totalCost += Number(blockchainData[batchId].Packaging.packaging_cost_mad) / 100;
    }

    // Quality control costs
    if (blockchainData[batchId]["Quality Control"]?.qc_cost_mad) {
      totalCost += Number(blockchainData[batchId]["Quality Control"].qc_cost_mad) / 100;
    }

    // Distributor costs
    if (blockchainData[batchId].Distributor?.shipping_cost_mad) {
      totalCost += Number(blockchainData[batchId].Distributor.shipping_cost_mad) / 100;
    }

    return totalCost;
  };

  // Calculate retail price with markup
  const calculateRetailPrice = (batchId) => {
    const productionCost = calculateProductionCost(batchId);
    if (!blockchainData[batchId]?.Retailer?.retail_markup_percent) {
      return productionCost;
    }

    const markup = Number(blockchainData[batchId].Retailer.retail_markup_percent) / 100;
    return productionCost * (1 + markup / 100);
  };

  // Calculate price per bottle or per kg based on quantity
  const calculateUnitPrice = (batchId) => {
    const retailPrice = calculateRetailPrice(batchId);
    
    // Try to get bottles produced first
    if (blockchainData[batchId]?.Packaging?.bottles_produced) {
      const bottles = Number(blockchainData[batchId].Packaging.bottles_produced) / 100;
      return bottles > 0 ? retailPrice / bottles : 0;
    }
    
    // Then try to get oil yield
    if (blockchainData[batchId]?.Processing?.oil_yield_liters) {
      const liters = Number(blockchainData[batchId].Processing.oil_yield_liters) / 100;
      return liters > 0 ? retailPrice / liters : 0;
    }
    
    // Then try to get harvested quantity
    if (blockchainData[batchId]?.Harvesting?.harvested_quantity_kg) {
      const kg = Number(blockchainData[batchId].Harvesting.harvested_quantity_kg) / 100;
      return kg > 0 ? retailPrice / kg : 0;
    }
    
    // Finally try to get olive quantity
    if (blockchainData[batchId]?.Cultivation?.olive_quantity_kg) {
      const kg = Number(blockchainData[batchId].Cultivation.olive_quantity_kg) / 100;
      return kg > 0 ? retailPrice / kg : 0;
    }
    
    return 0;
  };

  // Persistence effects
  useEffect(() => {
    saveToStorage('olivium_isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    saveToStorage('olivium_authRole', authRole);
  }, [authRole]);

  useEffect(() => {
    saveToStorage('olivium_isWalletConnected', isWalletConnected);
  }, [isWalletConnected]);

  useEffect(() => {
    saveToStorage('olivium_walletAddress', walletAddress);
  }, [walletAddress]);

  useEffect(() => {
    saveToStorage('olivium_selectedRole', selectedRole);
  }, [selectedRole]);

  useEffect(() => {
    saveToStorage('olivium_oliveGroveDetails', oliveGroveDetails);
  }, [oliveGroveDetails]);

  useEffect(() => {
    saveToStorage('olivium_registerData', registerData);
  }, [registerData]);

  useEffect(() => {
    saveToStorage('olivium_selectedBatch', selectedBatch);
  }, [selectedBatch]);

  useEffect(() => {
    saveToStorage('olivium_selectedSection', selectedSection);
  }, [selectedSection]);

  useEffect(() => {
    saveToStorage('olivium_batchObjectIds', batchObjectIds);
  }, [batchObjectIds]);

  useEffect(() => {
    saveToStorage('olivium_blockchainData', blockchainData);
  }, [blockchainData]);

  useEffect(() => {
    saveToStorage('olivium_formData', formData);
  }, [formData]);

  useEffect(() => {
    saveToStorage('olivium_batchRelatedObjects', batchRelatedObjects);
  }, [batchRelatedObjects]);
  useEffect(() => {
  if (selectedRole === "retailer" && walletAddress) {
 
    saveToStorage("walletretailer", walletAddress); // use walletAddress directly
  }
}, [selectedRole, walletAddress]);

useEffect(() => {
  // Fetch total transaction blocks
  fetch('http://127.0.0.1:9000', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "iota_getTotalTransactionBlocks",
      params: []
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.result !== undefined) {
        setTotalBlocks(data.result);
      }
    })
    .catch(err => console.error(err));

 

}, []); 

  // Update production costs when blockchain data changes
  useEffect(() => {
    if (selectedBatch && blockchainData[selectedBatch.id]) {
      const newCosts = { ...productionCosts };
      newCosts[selectedBatch.id] = calculateProductionCost(selectedBatch.id);
      setProductionCosts(newCosts);
      saveToStorage('olivium_productionCosts', newCosts);
      
      // Update olive quantities
      const newQuantities = { ...oliveQuantities };
      if (blockchainData[selectedBatch.id].Cultivation?.olive_quantity_kg) {
        newQuantities[selectedBatch.id] = Number(blockchainData[selectedBatch.id].Cultivation.olive_quantity_kg) / 100;
      } else if (blockchainData[selectedBatch.id].Harvesting?.harvested_quantity_kg) {
        newQuantities[selectedBatch.id] = Number(blockchainData[selectedBatch.id].Harvesting.harvested_quantity_kg) / 100;
      }
      setOliveQuantities(newQuantities);
      saveToStorage('olivium_oliveQuantities', newQuantities);
    }
  }, [blockchainData, selectedBatch]);
 const handleLogin = () => {
  if (passwordauthentication === password) {
    setIsAuthenticated(true);
    setAuthError(""); // Clear any previous errors
  setIsWalletConnected(false);
  } else {
   
    setAuthError("Incorrect password. Please try again.");
    setIsAuthenticated(false); 
    
   
     setpasswordauthentication("");
  }
};
 

  // Load batch data from blockchain
  async function loadBatchDataWithRetry(batchId, retryCount = 0, maxRetries = 3) {
  setLoading(true);
  setError("");

  let allSectionsData = {
    Cultivation: {},
    Harvesting: {},
    Processing: {},
    Packaging: {},
    "Quality Control": {},
    Distributor: {},
    Retailer: {},
  };

  try {
    const groveObjectId = batchObjectIds[batchId];
    
    if (groveObjectId) {
      try {
        const grove = await client.getObject({
          id: groveObjectId,
          options: { showContent: true, showType: true, showOwner: true },
        });

        let fields = null;
        if (grove.data?.content?.fields?.data?.fields) {
          fields = grove.data.content.fields.data.fields;
        } else if (grove.data?.content?.fields) {
          fields = grove.data.content.fields;
        }

        if (fields) {
          const cultivationData = {
            latitude_microdeg: fields.latitude_microdeg || "0",
            longitude_microdeg: fields.longitude_microdeg || "0",
            olive_variety_code: fields.olive_variety_code || "0",
            planting_year: fields.planting_year || "0",
            soil_ph: fields.soil_ph || "0",
            soil_moisture_percent: fields.soil_moisture_percent || "0",
            soil_ec: fields.soil_ec || "0",
            fertilizer_date: fields.fertilizer_date || "0",
            fertilizer_type: fields.fertilizer_type || "0",
            fertilizer_amount: fields.fertilizer_amount || "0",
            irrigation_type: fields.irrigation_type || "0",
            irrigation_amount: fields.irrigation_amount || "0",
            rainfall: fields.rainfall || "0",
            temperature_celsius: fields.temperature_celsius || "0",
            humidity_percent: fields.humidity_percent || "0",
            pest_control_date: fields.pest_control_date || "0",
            pest_control_type: fields.pest_control_type || "0",
            labor_worker_id: fields.labor_worker_id || "0",
            labor_hours_worked: fields.labor_hours_worked || "0",
            cost_per_hectare_mad: fields.cost_per_hectare_mad || "0",
            olive_quantity_kg: fields.olive_quantity_kg || "0",
            organization_pattern: fields.organization_pattern || "unknown",
          };
          
          
          // Only show cultivation data if it's from the same organization
          if (isDataFromSameOrganization(cultivationData)) {
            allSectionsData.Cultivation = cultivationData;
          }
        }
      } catch (e) {
        console.error("Could not load cultivation data:", e.message);
      }
    }

    // Load other sections data with organization filtering
    if (batchRelatedObjects[batchId]) {
      for (const [section, objectId] of Object.entries(batchRelatedObjects[batchId])) {
        try {
          const obj = await client.getObject({
            id: objectId,
            options: { showContent: true, showType: true, showOwner: true },
          });

          if (obj.data?.content?.fields) {
            const sectionData = {
              ...obj.data.content.fields.data.fields,
              organization_pattern: obj.data.content.fields.data.fields.organization_pattern || "unknown"
            };
            
            // Only show section data if it's from the same organization
            if (isDataFromSameOrganization(sectionData)) {
              allSectionsData[section] = sectionData;
            }
          }
        } catch (e) {
          console.error(`Could not load ${section} data:`, e.message);
        }
      }
    }

    setBlockchainData((prev) => ({
      ...prev,
      [batchId]: allSectionsData,
    }));

  } catch (error) {
    console.error("Error loading blockchain data:", error);
    setError(`Failed to load data for ${batchId}: ${error.message}`);
  } finally {
    setLoading(false);
  }
}

  const loadBatchData = (batchId) => {
    loadBatchDataWithRetry(batchId, 0, 3);
  };
  const handlesubmitpassword = ()=>{
    setorganization(true);
      setIsAuthenticated(false); 
      setSelectedRole(authRole);

  }

  
  useEffect(() => {
    if (selectedBatch && isWalletConnected) {
      loadBatchData(selectedBatch.id);
    }
  }, [selectedBatch, batchObjectIds, batchRelatedObjects, isWalletConnected]);

  // Form handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!selectedBatch) {
      alert("Please select a batch before submitting.");
      setLoading(false);
      return;
    }

    if (!gasPaymentObject) {
      alert("Gas payment object not loaded. Please refresh your wallet connection.");
      setLoading(false);
      return;
    }

    if (!walletKeypair) {
      alert("Wallet not connected properly. Please reconnect your wallet.");
      setLoading(false);
      return;
    }

    try {
      await findGasObjects(walletAddress);
      
      if (!gasPaymentObject) {
        throw new Error("Could not refresh gas payment object");
      }

      const tx = new Transaction();
      tx.setGasBudget(gasBudget);
      tx.setGasPayment([gasPaymentObject]);

      let result;

      switch (selectedRole) {
        case "farmer":
          tx.moveCall({
            target: `${packageId}::olivegrove::create_and_transfer_olive_grove`,
            arguments: [
              tx.pure.string(numericPattern|| "FARMER-DEFAULT"),
              tx.pure.string(formData.latitude_microdeg || "0"),
              tx.pure.string(formData.longitude_microdeg || "0"),
              tx.pure.string(formData.olive_variety_code || "0"),
              tx.pure.string(formData.planting_year || "0"),
              tx.pure.string(formData.soil_ph || "0"),
              tx.pure.string(formData.soil_moisture_percent || "0"),
              tx.pure.string(formData.soil_ec || "0"),
              tx.pure.string(formData.fertilizer_date || "0"),
              tx.pure.string(formData.fertilizer_type || "0"),
              tx.pure.string(formData.fertilizer_amount || "0"),
              tx.pure.string(formData.irrigation_type || "0"),
              tx.pure.string(formData.irrigation_amount || "0"),
              tx.pure.string(formData.rainfall || "0"),
              tx.pure.string(formData.temperature_celsius || "0"),
              tx.pure.string(formData.humidity_percent || "0"),
              tx.pure.string(formData.pest_control_date || "0"),
              tx.pure.string(formData.pest_control_type || "0"),
              tx.pure.string(formData.labor_worker_id || "0"),
              tx.pure.string(formData.labor_hours_worked || "0"),
              tx.pure.string(formData.cost_per_hectare_mad || "0"),
              tx.pure.string(formData.olive_quantity_kg || "0"),
              tx.pure.address(walletAddress),
            ],
          });
          break;

        case "harvester":
          tx.moveCall({
            target: `${packageId}::harvest::create_and_transfer_harvest`,
            arguments: [
              tx.pure.string(numericPattern || "HARVESTER-DEFAULT"),
              tx.pure.string(formData.harvest_date || "0"),
              tx.pure.string(formData.vehicle_id || "0"),
              tx.pure.string(formData.labor_worker_id || "0"),
              tx.pure.string(formData.labor_hours_worked || "0"),
              tx.pure.string(formData.harvesting_cost_mad || "0"),
              tx.pure.string(formData.harvested_quantity_kg || "0"),
              tx.pure.address(walletAddress),
            ],
          });
          break;

        case "processor":
          tx.moveCall({
            target: `${packageId}::processing::create_and_transfer_processing`,
            arguments: [
              tx.pure.string(numericPattern || "PROCESSOR-DEFAULT"),
              tx.pure.string(formData.press_method || "0"),
              tx.pure.string(formData.temperature_celsius || "0"),
              tx.pure.string(formData.labor_worker_id || "0"),
              tx.pure.string(formData.labor_hours_worked || "0"),
              tx.pure.string(formData.processing_cost_mad || "0"),
              tx.pure.string(formData.oil_yield_liters || "0"),
              tx.pure.address(walletAddress),
            ],
          });
          break;

        case "packager":
          tx.moveCall({
            target: `${packageId}::packaging::create_and_transfer_packaging`,
            arguments: [
              tx.pure.string(numericPattern || "PACKAGER-DEFAULT"),
              tx.pure.string(formData.seal_status || "0"),
              tx.pure.string(formData.packaging_date || "0"),
              tx.pure.string(formData.labor_worker_id || "0"),
              tx.pure.string(formData.packaging_cost_mad || "0"),
              tx.pure.string(formData.bottles_produced || "0"),
              tx.pure.address(walletAddress),
            ],
          });
          break;

        case "quality controller":
          tx.moveCall({
            target: `${packageId}::qualitycontrol::create_and_transfer_quality_control`,
            arguments: [
              tx.pure.string(numericPattern || "QC-DEFAULT"),
              tx.pure.string(formData.qc_passed ? "true" : "false"),
              tx.pure.string(formData.qc_date || "0"),
              tx.pure.string(formData.qc_inspector_id || "0"),
              tx.pure.string(formData.qc_cost_mad || "0"),
              tx.pure.address(walletAddress),
            ],
          });
          break;

        case "distributor":
          tx.moveCall({
            target: `${packageId}::distributor::create_and_transfer_distributor`,
            arguments: [
              tx.pure.string(numericPattern || "DISTRIBUTOR-DEFAULT"),
              tx.pure.string(formData.distributor_location || ""),
              tx.pure.string(formData.distributor_shipment_id || ""),
              tx.pure.string(formData.distributor_date || "0"),
              tx.pure.string(formData.shipping_cost_mad || "0"),
              tx.pure.address(walletAddress),
            ],
          });
          break;

        case "retailer":
          tx.moveCall({
            target: `${packageId}::retailer::create_and_transfer_retailer`,
            arguments: [
              tx.pure.string(numericPattern || "RETAILER-DEFAULT"),
              tx.pure.string(formData.shelf_position || ""),
              tx.pure.string(formData.retailer_arrival_date || "0"),
              tx.pure.string(formData.retailer_feedback_score || "0"),
              tx.pure.string(formData.retail_markup_percent || "0"),
              tx.pure.string(formData.price_per_bottle_mad || "0"),
              tx.pure.address(walletAddress),
            ],
          });
          break;

        default:
          alert("Role not supported for data submission.");
          setLoading(false);
          return;
      }

      result = await client.signAndExecuteTransaction({
        transaction: tx,
        signer: walletKeypair,
        options: {
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
          showBalanceChanges: true,
        },
      });

      if (result.effects?.status?.status === "success") {
    // Update related objects if this is a new object creation
    if (selectedRole === "farmer"  && result.effects.created) {
        const groveObject = result.effects.created.find(obj => obj.owner !== "Immutable");
        if (groveObject) {
            const newGroveObjectId = groveObject.reference.objectId;
            setBatchObjectIds(prev => ({
                ...prev,
                [selectedBatch.id]: newGroveObjectId
            }));
            setDatasubmitted(true);
        }
        

    } else if (result.effects.created) {
        // For other roles, store their object IDs
        const newObject = result.effects.created.find(obj => obj.owner !== "Immutable");
        if (newObject) {
            const section = getUserSection(selectedRole);
            setBatchRelatedObjects(prev => ({
                ...prev,
                [selectedBatch.id]: {
                    ...(prev[selectedBatch.id] || {}),
                    [section]: newObject.reference.objectId
                }
            }));
        }
        setDatasubmitted(true);
    }

    // Update blockchain data with form data
    const updatedData = { ...formData };
    const section = getUserSection(selectedRole);
    
    setBlockchainData(prev => ({
        ...prev,
        [selectedBatch.id]: {
            ...prev[selectedBatch.id],
            [section]: updatedData,
        }
    }));


        alert("Data submitted and recorded on blockchain successfully!");
        setFormData({});
      } else {
        throw new Error("Transaction failed: " + JSON.stringify(result.effects?.status));
      }

      // Refresh wallet balance and gas objects
      setTimeout(() => {
        updateWalletBalance(walletAddress);
        findGasObjects(walletAddress);
      }, 1000);

    } catch (error) {
      console.error("❌ Error executing transaction:", error);
      setError("Blockchain transaction failed: " + error.message);
      alert("Blockchain transaction error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const rewardUser = async () => {
  if (!isWalletConnected || !walletAddress) {
    alert("Please connect your wallet first.");
    return;
  }

  setLoading(true);
  setError("");

  try {
    // 1. Find recipientAddress's gas objects (must exist!)
    const ownedObjects = await client.getOwnedObjects({
      owner: recipientAddress,
      filter: { StructType: "0x2::coin::Coin<0x2::iota::IOTA>" },
      options: { showContent: true }
    });

    if (!ownedObjects.data?.length) {
      throw new Error("Reward pool has no gas objects");
    }

    // 2. Prepare transaction
    const tx = new Transaction();
    const gasObject = ownedObjects.data[0]; // Use first gas object

    tx.setGasBudget(gasBudget);
    tx.setGasPayment([{
      objectId: gasObject.data.objectId,
      version: gasObject.data.version,
      digest: gasObject.data.digest,
      amount: BigInt(gasObject.data.content.fields.balance),
    }]);

    // 3. Split coins from recipientAddress and send to user
    const [coin] = tx.splitCoins(tx.gas, [1000000000]); // Split reward amount
    tx.transferObjects([coin], walletAddress); // Send to user

    // 4. Sign with recipient's keypair (this is CORRECT in your code)
    const result = await client.signAndExecuteTransaction({
      transaction: tx,
      signer: keypair, // ✅ This is recipientAddress's keypair
      options: { showEffects: true }
    });

    if (result.effects?.status?.status === "success") {
      alert("Reward sent successfully!");
      await updateWalletBalance(walletAddress); // Refresh user's balance
    } else {
      throw new Error("Transaction failed");
    }
  } catch (error) {
    console.error("Reward failed:", error);
    setError("Reward failed: " + error.message);
  } finally {
    setLoading(false);
  }
};
  // Helper function to format field values for display
  const formatFieldValue = (key, value) => {
    const numValue = Number(value);
    
    if (key.includes("latitude") || key.includes("longitude")) {
      return (numValue / 1000000).toFixed(6) + "°";
    }
    if (key.includes("ph")) {
      return (numValue / 100).toFixed(2);
    }
    if (key.includes("percent")) {
      return (numValue / 100).toFixed(1) + "%";
    }
    if (key.includes("temperature")) {
      return (numValue / 100).toFixed(1) + "°C";
    }
    if (key.includes("cost") || key.includes("price") || key.includes("mad")) {
      return (numValue / 100).toFixed(2) + " MAD";
    }
    if (key.includes("quantity") || key.includes("yield") || key.includes("bottles")) {
      return (numValue / 100).toFixed(2) + (key.includes("kg") ? " kg" : key.includes("liters") ? " L" : "");
    }
    if (key.includes("date")) {
      return numValue.toString();
    }
    if (key === "qc_passed") {
      return value === "true" ? "✅ Passed" : "❌ Failed";
    }
    
    return value.toString();
  };

  // Helper function to provide field placeholders
  const getFieldPlaceholder = (field) => {
    const placeholders = {
      latitude_microdeg: "e.g., 32345123 (32.345123° in microdegrees)",
      longitude_microdeg: "e.g., 6240500 (6.240500° in microdegrees)",
      soil_ph: "e.g., 650 (6.5 × 100)",
      soil_moisture_percent: "e.g., 2700 (27% × 100)",
      temperature_celsius: "e.g., 3200 (32°C × 100)",
      humidity_percent: "e.g., 4000 (40% × 100)",
      cost_per_hectare_mad: "e.g., 420000 (4200.00 MAD × 100)",
      harvesting_cost_mad: "e.g., 150000 (1500.00 MAD × 100)",
      processing_cost_mad: "e.g., 80000 (800.00 MAD × 100)",
      packaging_cost_mad: "e.g., 50000 (500.00 MAD × 100)",
      qc_cost_mad: "e.g., 30000 (300.00 MAD × 100)",
      shipping_cost_mad: "e.g., 120000 (1200.00 MAD × 100)",
      retail_markup_percent: "e.g., 3000 (30% × 100)",
      olive_quantity_kg: "e.g., 500000 (5000.00 kg × 100)",
      harvested_quantity_kg: "e.g., 400000 (4000.00 kg × 100)",
      oil_yield_liters: "e.g., 10000 (100.00 L × 100)",
      bottles_produced: "e.g., 5000 (50 bottles × 100)",
      price_per_bottle_mad: "e.g., 20000 (200.00 MAD × 100)",
      harvest_date: "e.g., 20230815 (YYYYMMDD)",
      qc_passed: "Enter 'true' or 'false'",
      distributor_location: "e.g., 'Warehouse 5, Casablanca'",
      shelf_position: "e.g., 'Aisle 3, Shelf 2'",
    };
    
    return placeholders[field] || "Enter value";
  };

  // Get the user's allowed section for data registration
  const getUserSection = (role) => {
    const sectionMap = {
      farmer: "Cultivation",
      harvester: "Harvesting",
      processor: "Processing",
      packager: "Packaging",
      "quality controller": "Quality Control",
      distributor: "Distributor",
      retailer: "Retailer"
    };
    return sectionMap[role] || "";
  };
if (!authenticatedorganization ) {
  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        
        {/* Title */}
        <h1 className="text-2xl font-bold mb-6 text-center text-green-700">
          Organization Password Generator
        </h1>

        {/* Role Selection */}
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
          Select Your Role
        </label>
        <select
          id="role"
          value={authRole}
          onChange={(e) => setAuthRole(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-6"
          required
        >
          <option value="">-- Select Role --</option>
          <option value="farmer">Farmer</option>
          <option value="harvester">Harvester</option>
          <option value="processor">Processor</option>
          <option value="packager">Packager</option>
          <option value="quality controller">Quality Controller</option>
          <option value="distributor">Distributor</option>
          <option value="retailer">Retailer</option>
          <option value="customer">Customer</option>
        </select>

        {/* Organization Name Input */}
        <input
          type="text"
          placeholder="Enter organization name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          className="border border-gray-300 rounded-lg w-full p-3 mb-6 focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />

        {/* Generate Password Button */}
        <button
          onClick={generatePassword}
          className="bg-green-600 text-white px-4 py-3 rounded-lg w-full hover:bg-green-700 transition mb-6 font-medium"
        >
          Generate Password
        </button>

        {/* Display Password */}
        {password && (
          <div className="mt-2 p-3 border border-gray-300 rounded-lg bg-gray-50 text-center font-mono text-lg mb-6">
            {password}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handlesubmitpassword}
          className="bg-blue-600 text-white px-4 py-3 rounded-lg w-full hover:bg-blue-700 transition font-medium"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

  // Authentication screen
  if(!isAuthenticated && authenticatedorganization ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-96 border border-gray-200">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🌿 Olivium</h1>
            <p className="text-gray-600">Role-based authentication for the olive supply chain</p>
          </div>

          {authError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {authError}
            </div>
          )}

          
            

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={passwordauthentication}
                onChange={(e) => setpasswordauthentication(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Authenticate
            </button>
          

          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-600">
            <p className="font-semibold mb-2">Note:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Each role has specific permissions and access levels</li>
              <li>Authentication is required before accessing the dashboard</li>
              <li>Contact your administrator for role credentials</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Wallet connection screen
  if (!isWalletConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-96 border border-gray-200">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🌿 Olivium</h1>
            <p className="text-gray-600">Connect your IOTA wallet as {authRole}</p>
          </div>

          {walletError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {walletError}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={generateNewWallet}
              disabled={walletLoading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {walletLoading ? "Generating..." : "🆕 Generate New Wallet"}
            </button>

            <div className="text-center text-gray-500 text-sm">or</div>

            <div className="space-y-2">
              <input
                type="password"
                placeholder="Enter existing private key (iotaprivkey1...)"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    connectExistingWallet(e.target.value.trim());
                  }
                }}
              />
              <button
                onClick={() => {
                  if (privateKey.trim()) {
                    connectExistingWallet(privateKey.trim());
                  }
                }}
                disabled={walletLoading || !privateKey.trim()}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {walletLoading ? "Connecting..." : "🔗 Connect Existing Wallet"}
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-600">
            <p className="font-semibold mb-2">Note:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>New wallets need to be funded with IOTA tokens to pay for gas</li>
              <li>Your private key is only stored in memory during this session</li>
              <li>Never share your private key with anyone</li>
              <li>After generating a wallet, save your private key to reconnect later</li>
            </ul>
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition font-semibold"
          >
            ← Back to Role Selection
          </button>
        </div>
      </div>
    );
  }
  const refreshiotabalance = ()=>{
    updateWalletBalance(walletAddress);
  }
 // Replace your original payretailer function with this:


  const isCustomer = selectedRole === "customer";
  const userSection = getUserSection(selectedRole);

  return (
    <div className="font-serif min-h-screen bg-gray-50">
      <nav className="bg-green-600 shadow-md w-full h-20 flex items-center justify-between px-10 text-white">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold tracking-wide">
            🌿 Olivium Dashboard
          </h1>
          <div className="bg-green-700 px-3 py-1 rounded-full text-sm">
            Role: {selectedRole}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-green-700 px-4 py-2 rounded-lg text-sm">
            <div className="font-semibold flex items-center">
              <span className="mr-2">Wallet:</span>
              <span 
                className="cursor-pointer hover:text-green-200 transition"
                onClick={() => {
                  navigator.clipboard.writeText(walletAddress);
                  alert("Wallet address copied to clipboard!");
                }}
                title="Click to copy"
              >
                {walletAddress}
              </span>
            </div>
            <div>Balance: {(Number(walletBalance) / 1000000000).toFixed(4)} IOTA</div>
            <button onClick={refreshiotabalance} className="hover:bg-sky-700" >Refresh</button>
          </div>
          
          <button
            onClick={() => {
              disconnectWallet();
              handleLogout();
            }}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded transition"
          >
            🔌 Logout
          </button>
        </div>
      </nav>

      <div className="flex min-h-screen">
        <aside className="bg-green-950 w-60 min-h-screen p-6 shadow-lg">
          <ul className="text-white space-y-6">
            
            <li
              onClick={() => {
                setOliveGroveDetails(true);
                setRegisterData(false);
               setNetworkDetails(false);
                setError("");
              }}
              className={`border border-green-500 rounded-lg py-3 px-4 hover:bg-green-800 hover:text-cyan-300 transition-all duration-200 cursor-pointer ${
                oliveGroveDetails ? "bg-green-800 text-cyan-300" : ""
              }`}
            >
              🌳 Olive Grove Details
            </li>
          {!isCustomer && (
                          <li
                onClick={() => {
                 setNetworkDetails(false);
                  setRegisterData(true);
                  setOliveGroveDetails(false);
                  setError("");
                
                }}
                className={`border border-green-500 rounded-lg py-3 px-4 hover:bg-green-800 hover:text-cyan-300 transition-all duration-200 cursor-pointer ${
                  registerData ? "bg-green-800 text-cyan-300" : ""
                }`}
              >
                ➕ Register Data
              </li>
          )}            
            <li
  onClick={() => {
    setNetworkDetails(true);
    setOliveGroveDetails(false);
    setRegisterData(false);
    setError("");
  }}
  className={`border border-green-500 rounded-lg py-3 px-4 hover:bg-green-800 hover:text-cyan-300 transition-all duration-200 cursor-pointer ${
    networkDetails ? "bg-green-800 text-cyan-300" : ""
  }`}
>
  🌐 Go Network Details
</li>



          </ul>
          
          <div className="mt-8 bg-green-800 rounded-lg p-4 text-white">
            <h3 className="text-sm font-semibold mb-2">Wallet Status</h3>
            <div className="text-xs space-y-1">
              <div className="break-all">Address: {walletAddress}</div>
              <div>Balance: {(Number(walletBalance) / 1000000000).toFixed(4)} IOTA</div>
              {gasPaymentObject && (
                <div className="text-green-200">Gas: ✅ Ready</div>
              )}
              {gasObjectError && (
                <div className="text-red-300">Gas: ❌ {gasObjectError.slice(0, 20)}...</div>
              )}
            </div>
            <button
              onClick={() => {
                updateWalletBalance(walletAddress);
                findGasObjects(walletAddress);
              }}
              className="mt-2 bg-green-600 hover:bg-green-700 text-xs px-2 py-1 rounded"
            >
              Refresh
            </button>
          </div>

          {privateKey && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-2 text-yellow-800">Your Private Key</h3>
              <div className="text-xs text-yellow-700 break-all mb-2">
                {privateKey}
              </div>
              <p className="text-xs text-yellow-600">
                ⚠️ Save this key to reconnect later. It won't be shown again.
              </p>
            </div>
          )}
        </aside>
       { !networkDetails && (
        <main className="flex-grow p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
              Loading blockchain data...
            </div>
          )}

          {gasObjectError &&  (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <strong>Gas Object Warning:</strong> {gasObjectError}
              <button
                onClick={() => findGasObjects(walletAddress)}
                className="ml-2 bg-yellow-600 text-white px-2 py-1 rounded text-sm hover:bg-yellow-700"
              >
                Retry
              </button>
            </div>
          )}
        
          <section>
            <h2 className="text-xl mb-4">
              Select a batch to view/register data:
            </h2>
            <select
              value={selectedBatch?.id || ""}
              onChange={(e) =>
                setSelectedBatch(
                  batches.find((b) => b.id === e.target.value) || null
                )
              }
              className="border border-gray-400 rounded px-3 py-2"
            >
              <option value="">-- Select a batch --</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.id} {batchObjectIds[batch.id] ? "✅" : "⚪"}
                </option>
              ))}
            </select>
            
            {selectedBatch && (
              <p className="text-sm text-gray-600 mt-2">
                Cultivation Object ID: {batchObjectIds[selectedBatch.id] || "Not created yet"}
                <br />
                {batchRelatedObjects[selectedBatch.id] && Object.keys(batchRelatedObjects[selectedBatch.id]).length > 0 && (
                  <>
                    Related Objects: {Object.keys(batchRelatedObjects[selectedBatch.id]).join(", ")}
                  </>
                )}
              </p>
            )}
            
          </section>
          
        {oliveGroveDetails && selectedBatch && !networkDetails && (
 <section className="mb-8 mt-6">
   <h2 className="text-2xl font-semibold mb-4">
     Batch {selectedBatch.id} Data - All Sections
   </h2>
   
   {/* Display blockchain data for all sections */}
   {blockchainData[selectedBatch.id] ? (
     <div className="space-y-6">
       {Object.entries(sectionKeys).map(([sectionName, sectionFields]) => (
         <div key={sectionName} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
           <h3 className="text-xl font-bold mb-4 text-green-700 border-b border-green-200 pb-2">
             {sectionName}
           </h3>
           
           {blockchainData[selectedBatch.id][sectionName] && 
            Object.keys(blockchainData[selectedBatch.id][sectionName]).length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {sectionFields.map((field) => {
                 const value = blockchainData[selectedBatch.id][sectionName][field];
                 if (value && value !== "0" && value !== null && value !== undefined) {
                   return (
                     <div key={field} className="bg-gray-50 p-3 rounded border">
                       <div className="text-sm font-semibold text-gray-600 mb-1">
                         {field.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                       </div>
                       <div className="text-lg text-gray-800">
                         {formatFieldValue(field, value)}
                       </div>
                     </div>
                   );
                 }
                 return null;
               })}
             </div>
           ) : (
             <div className="text-gray-500 italic">
               No data available for this section yet.
             </div>
           )}
         </div>
       ))}
     </div>
   ) : (
     <div className="text-gray-500 italic">
       No blockchain data found for this batch.
     </div>
   )}
 </section>
)}
            
              {(selectedRole === "retailer" || selectedRole === "customer") && (
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-3 text-green-700">Cost Breakdown and data </h3>

        {(() => {
          const qrDataParts = [];

          const batchData = blockchainData[selectedBatch.id];
  if (batchData) {
    Object.entries(batchData).forEach(([section, sectionData]) => {
      if (sectionData && typeof sectionData === "object") {
        Object.entries(sectionData).forEach(([key, value]) => {
          if (value !== "0" && value !== null && value !== undefined) {
            qrDataParts.push(
              `${section} - ${key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}: ${formatFieldValue(key, value)}`
            );
          }
        });
      }
    });
  }

          if (blockchainData[selectedBatch.id]?.Cultivation?.cost_per_hectare_mad) {
            qrDataParts.push(
              `Farming: ${formatFieldValue(
                "cost_per_hectare_mad",
                blockchainData[selectedBatch.id].Cultivation.cost_per_hectare_mad
              )}`
            );
          }
          if (blockchainData[selectedBatch.id]?.Harvesting?.harvesting_cost_mad) {
            qrDataParts.push(
              `Harvesting: ${formatFieldValue(
                "harvesting_cost_mad",
                blockchainData[selectedBatch.id].Harvesting.harvesting_cost_mad
              )}`
            );
          }
          if (blockchainData[selectedBatch.id]?.Processing?.processing_cost_mad) {
            qrDataParts.push(
              `Processing: ${formatFieldValue(
                "processing_cost_mad",
                blockchainData[selectedBatch.id].Processing.processing_cost_mad
              )}`
            );
          }
          if (blockchainData[selectedBatch.id]?.Packaging?.packaging_cost_mad) {
            qrDataParts.push(
              `Packaging: ${formatFieldValue(
                "packaging_cost_mad",
                blockchainData[selectedBatch.id].Packaging.packaging_cost_mad
              )}`
            );
          }
          if (blockchainData[selectedBatch.id]?.["Quality Control"]?.qc_cost_mad) {
            qrDataParts.push(
              `Quality Control: ${formatFieldValue(
                "qc_cost_mad",
                blockchainData[selectedBatch.id]["Quality Control"].qc_cost_mad
              )}`
            );
          }
          if (blockchainData[selectedBatch.id]?.Distributor?.shipping_cost_mad) {
            qrDataParts.push(
              `Shipping: ${formatFieldValue(
                "shipping_cost_mad",
                blockchainData[selectedBatch.id].Distributor.shipping_cost_mad
              )}`
            );
          }

          qrDataParts.push(
            `Total Production Cost: ${formatFieldValue(
              "total_cost",
              calculateProductionCost(selectedBatch.id) * 100
            )}`
          );

          if (blockchainData[selectedBatch.id]?.Cultivation?.olive_quantity_kg) {
            qrDataParts.push(
              `Estimated Olive Quantity: ${formatFieldValue(
                "olive_quantity_kg",
                blockchainData[selectedBatch.id].Cultivation.olive_quantity_kg
              )}`
            );
          }
          if (blockchainData[selectedBatch.id]?.Harvesting?.harvested_quantity_kg) {
            qrDataParts.push(
              `Harvested Quantity: ${formatFieldValue(
                "harvested_quantity_kg",
                blockchainData[selectedBatch.id].Harvesting.harvested_quantity_kg
              )}`
            );
          }
          if (blockchainData[selectedBatch.id]?.Processing?.oil_yield_liters) {
            qrDataParts.push(
              `Oil Yield: ${formatFieldValue(
                "oil_yield_liters",
                blockchainData[selectedBatch.id].Processing.oil_yield_liters
              )}`
            );
          }
          if (blockchainData[selectedBatch.id]?.Packaging?.bottles_produced) {
            qrDataParts.push(
              `Bottles Produced: ${formatFieldValue(
                "bottles_produced",
                blockchainData[selectedBatch.id].Packaging.bottles_produced
              )}`
            );
          }
          if (
            selectedRole === "retailer" &&
            blockchainData[selectedBatch.id]?.Retailer?.retail_markup_percent
          ) {
            qrDataParts.push(
              `Markup: ${formatFieldValue(
                "retail_markup_percent",
                blockchainData[selectedBatch.id].Retailer.retail_markup_percent
              )}`
            );
          }
          if (selectedRole === "customer") {
            qrDataParts.push(
              `Price per Bottle: ${formatFieldValue(
                "price_per_bottle_mad",
                calculateUnitPrice(selectedBatch.id) * 100
              )}`
            );
          }

          const qrText = qrDataParts.join("\n");

          return (
            <div className="mt-6 flex justify-center">
              <QRCode value={qrText} size={200} />
            </div>
          );
        })()}   </div>
    )}

             

             
                
              
            
          

          {registerData && !isCustomer && selectedBatch && !networkDetails && !oliveGroveDetails && (
            <section className="mt-6 max-w-2xl">
              <h2 className="text-2xl font-semibold mb-4">
                Register Data - {userSection}
              </h2>
              
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
                <p className="text-sm">
                  <strong>Note:</strong> As a {selectedRole}, you can only register data for the {userSection} section. 
                  You can view all sections in "Olive Grove Details".
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Wallet:</strong> {walletAddress}
                  </div>
                  <div>
                    <strong>Balance:</strong> {(Number(walletBalance) / 1000000000).toFixed(4)} IOTA
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  {gasPaymentObject ? (
                    <span className="text-green-600">✅ Gas object ready for transactions</span>
                  ) : (
                    <span className="text-red-600">❌ No  found. Please fund your wallet.</span>
                  )}
                </div>
              </div>
              
              <div className="space-y-4 bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sectionKeys[userSection]?.map((field) => (
                    <div key={field} className="flex flex-col">
                      <label htmlFor={field} className="font-semibold mb-1 text-gray-700">
                        {field.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                      {field === "qc_passed" ? (
                        <select
                          id={field}
                          name={field}
                          value={formData[field] || ""}
                          onChange={handleChange}
                          className="border border-gray-400 rounded px-3 py-2 focus:border-green-500 focus:outline-none"
                        >
                          <option value="">Select QC status</option>
                          <option value="true">Passed</option>
                          <option value="false">Failed</option>
                        </select>
                      ) : (
                        <input
                          type={"text"}
                          id={field}
                          name={field}
                          value={formData[field] || ""}
                          onChange={handleChange}
                          className="border border-gray-400 rounded px-3 py-2 focus:border-green-500 focus:outline-none"
                          placeholder={getFieldPlaceholder(field)}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading || !gasPaymentObject}
                  className="bg-green-600 text-white rounded px-6 py-3 hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit to Blockchain"}
                </button>

                <button
                  onClick={rewardUser}
                  disabled={loading || !isWalletConnected || !walletKeypair || !gasPaymentObject || !datasubmitted}
                  className="bg-green-600 text-white rounded px-6 py-3 hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                Get Reward
                </button>
              </div>
            </section>
    
          )}

    

        </main>
       )}
         
{networkDetails && (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-blue-200 dark:border-gray-700 shadow-lg w-full h-screen overflow-y-auto">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Blockchain Network Details
      </h1>
    </div>
    
    <div className="grid gap-4 md:grid-cols-2">
      {/* Transaction Blocks Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Transaction Blocks
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total blocks in the network
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {totalBlocks}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              BLOCKS
            </div>
          </div>
        </div>
      </div>
    </div> 
  </div>
)}
      </div>
    </div>
  );
}

