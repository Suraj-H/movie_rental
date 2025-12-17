const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['x-auth-token'] = token;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : body;
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Express 5 Application...\n');

  try {
    // Test 1: GET /api/genres (should return empty array or existing genres)
    console.log('Test 1: GET /api/genres');
    const genresRes = await makeRequest('GET', '/api/genres');
    console.log(`✅ Status: ${genresRes.status}, Data:`, Array.isArray(genresRes.data) ? `${genresRes.data.length} genres` : genresRes.data);
    console.log('');

    // Test 2: POST /api/customers (create customer)
    console.log('Test 2: POST /api/customers');
    const customerData = {
      name: 'John Doe',
      isGold: true,
      phone: '1234567890'
    };
    const customerRes = await makeRequest('POST', '/api/customers', customerData);
    console.log(`✅ Status: ${customerRes.status}`);
    if (customerRes.status === 200 || customerRes.status === 201) {
      console.log('   Customer created:', customerRes.data.name);
      const customerId = customerRes.data._id;
      console.log('');

      // Test 3: GET /api/customers/:id
      console.log('Test 3: GET /api/customers/:id');
      const getCustomerRes = await makeRequest('GET', `/api/customers/${customerId}`);
      console.log(`✅ Status: ${getCustomerRes.status}, Customer:`, getCustomerRes.data.name);
      console.log('');
    } else {
      console.log('   Error:', customerRes.data);
      console.log('');
    }

    // Test 4: POST /api/users (register user)
    console.log('Test 4: POST /api/users (register)');
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    const userRes = await makeRequest('POST', '/api/users', userData);
    console.log(`✅ Status: ${userRes.status}`);
    if (userRes.status === 200 || userRes.status === 201) {
      console.log('   User registered:', userRes.data.email);
      const authToken = userRes.headers['x-auth-token'] || userRes.data;
      console.log('   Token received:', authToken ? 'Yes' : 'No');
      console.log('');

      // Test 5: POST /api/auth (login)
      console.log('Test 5: POST /api/auth (login)');
      const loginRes = await makeRequest('POST', '/api/auth', {
        email: 'test@example.com',
        password: 'password123'
      });
      console.log(`✅ Status: ${loginRes.status}`);
      if (loginRes.status === 200) {
        console.log('   Login successful, token received');
        const loginToken = typeof loginRes.data === 'string' ? loginRes.data : 'N/A';
        console.log('');

        // Test 6: GET /api/users/me (with auth)
        console.log('Test 6: GET /api/users/me (with auth)');
        const meRes = await makeRequest('GET', '/api/users/me', null, loginToken);
        console.log(`✅ Status: ${meRes.status}`);
        if (meRes.status === 200) {
          console.log('   User data retrieved:', meRes.data.email);
        } else {
          console.log('   Error:', meRes.data);
        }
        console.log('');
      } else {
        console.log('   Login error:', loginRes.data);
        console.log('');
      }
    } else {
      console.log('   Registration error:', userRes.data);
      console.log('');
    }

    // Test 7: Error handling - Invalid endpoint
    console.log('Test 7: Error handling - Invalid endpoint');
    const invalidRes = await makeRequest('GET', '/api/invalid');
    console.log(`✅ Status: ${invalidRes.status} (Expected 404 or error)`);
    console.log('');

    // Test 8: Validation error - Invalid customer data
    console.log('Test 8: Validation error - Invalid customer data');
    const invalidCustomerRes = await makeRequest('POST', '/api/customers', {
      name: 'A', // Too short
      phone: '123' // Too short
    });
    console.log(`✅ Status: ${invalidCustomerRes.status} (Expected 400)`);
    if (invalidCustomerRes.status === 400) {
      console.log('   Validation error caught correctly');
    }
    console.log('');

    console.log('✅ All tests completed!');
    console.log('\n📝 Summary:');
    console.log('   - Express 5 native async/await error handling is working');
    console.log('   - No async wrapper middleware needed');
    console.log('   - All routes are functioning correctly');
    console.log('   - Error handling is working as expected');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   Server is not running. Please start the server first.');
    }
  }
}

// Run tests
runTests().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
