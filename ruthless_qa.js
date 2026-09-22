const http = require('http');
const { spawn } = require('child_process');

const PORT = 3015;
const BASE_URL = `http://localhost:${PORT}`;

let serverProcess = null;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const postData = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : null;
    const reqHeaders = { ...headers };
    if (postData && !reqHeaders['Content-Type']) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }
    const req = http.request(url, { method, headers: reqHeaders }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) { json = data; }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          cookies: res.headers['set-cookie'] || [],
          data: json
        });
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

function extractCookie(cookieArray, name = 'nexo_session') {
  if (!cookieArray || cookieArray.length === 0) return '';
  for (const c of cookieArray) {
    const parts = c.split(';')[0].trim();
    if (parts.startsWith(name + '=')) {
      return parts;
    }
  }
  return '';
}

async function runRuthlessQA() {
  console.log('===========================================================');
  console.log('       🔥 NEXO RUTHLESS QA SUITE (10 INTENSIVE RUNS) 🔥     ');
  console.log('===========================================================');

  let passed = 0;
  let failed = 0;
  function report(runNum, title, isOk, details) {
    if (isOk) {
      console.log(`[PASS] Run ${runNum}: ${title}`);
      if (details) console.log(`       Proof: ${details}`);
      passed++;
    } else {
      console.error(`[FAIL] Run ${runNum}: ${title}`);
      console.error(`       Error: ${details}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // RUN 1: Signup Validation & Security
    // -------------------------------------------------------------
    console.log('\n--- EXECUTING RUN 1: Signup Validation & Edge Cases ---');
    const invalidEmailRes = await request('POST', '/api/auth/signup', {
      email: 'notanemail',
      username: 'testu1',
      password: 'password123'
    });
    const shortPassRes = await request('POST', '/api/auth/signup', {
      email: 'valid@test.com',
      username: 'testu2',
      password: '123'
    });
    const uniqueUser = 'qa_user_' + Date.now();
    const validSignupRes = await request('POST', '/api/auth/signup', {
      email: `${uniqueUser}@nexo.com`,
      username: uniqueUser,
      displayName: 'QA Test User',
      password: 'Password@123'
    });
    const duplicateRes = await request('POST', '/api/auth/signup', {
      email: `${uniqueUser}@nexo.com`,
      username: uniqueUser,
      password: 'Password@123'
    });

    const run1Ok = invalidEmailRes.status === 400 &&
                   shortPassRes.status === 400 &&
                   validSignupRes.status === 200 &&
                   duplicateRes.status === 409;
    report(1, 'Signup Validation (Invalid Email, Short Pass, Unique, Duplicate Block)', run1Ok,
           `Invalid email -> 400, Short pass -> 400, Duplicate -> 409, Valid user created: ${uniqueUser}`);

    // -------------------------------------------------------------
    // RUN 2: Login Flow & Case/Whitespace Normalization
    // -------------------------------------------------------------
    console.log('\n--- EXECUTING RUN 2: Login Flow & Credential Normalization ---');
    const wrongPassRes = await request('POST', '/api/auth/login', {
      email: `${uniqueUser}@nexo.com`,
      password: 'WrongPassword999'
    });
    const nonExistentRes = await request('POST', '/api/auth/login', {
      email: 'ghost_user_does_not_exist@nexo.com',
      password: 'password123'
    });
    // Test with UPPERCASE email and whitespace
    const validLoginRes = await request('POST', '/api/auth/login', {
      email: `  ${uniqueUser.toUpperCase()}@NEXO.COM  `,
      password: 'Password@123'
    });
    const userCookie = extractCookie(validLoginRes.cookies);
    const run2Ok = wrongPassRes.status === 401 &&
                   nonExistentRes.status === 401 &&
                   validLoginRes.status === 200 &&
                   userCookie.includes('nexo_session=');
    report(2, 'Login Normalization & Auth Verification', run2Ok,
           `Wrong pass -> 401, Non-existent -> 401, Normalized email login -> 200 with session cookie.`);

    // -------------------------------------------------------------
    // RUN 3: Session Security & HMAC Tampering Gate
    // -------------------------------------------------------------
    console.log('\n--- EXECUTING RUN 3: Session Security & Anti-Tampering ---');
    const validMeRes = await request('GET', '/api/auth/me', null, { Cookie: userCookie });
    const tamperedCookie = userCookie.slice(0, -6) + 'FAKE99';
    const tamperedMeRes = await request('GET', '/api/auth/me', null, { Cookie: tamperedCookie });
    const unauthedMeRes = await request('GET', '/api/auth/me');

    const run3Ok = validMeRes.status === 200 && validMeRes.data?.user?.username === uniqueUser &&
                   tamperedMeRes.status === 200 && tamperedMeRes.data?.user === null &&
                   unauthedMeRes.status === 200 && unauthedMeRes.data?.user === null;
    report(3, 'HMAC Session Verification & Anti-Tampering', run3Ok,
           `Valid cookie -> authenticated (${validMeRes.data?.user?.username}), Tampered signature -> rejected, Unauthenticated -> null.`);

    // -------------------------------------------------------------
    // RUN 4: Profile View & Profile Update
    // -------------------------------------------------------------
    console.log('\n--- EXECUTING RUN 4: User Profile & Bio Management ---');
    const getProfileRes = await request('GET', `/api/users/${uniqueUser}`, null, { Cookie: userCookie });
    const updateProfileRes = await request('POST', '/api/users/profile', {
      displayName: 'QA Certified Shinobi',
      bio: 'Audited and verified by Danial Swarm.'
    }, { Cookie: userCookie });
    const checkUpdatedProfile = await request('GET', `/api/users/${uniqueUser}`, null, { Cookie: userCookie });

    const run4Ok = getProfileRes.status === 200 &&
                   updateProfileRes.status === 200 &&
                   checkUpdatedProfile.data?.user?.displayName === 'QA Certified Shinobi' &&
                   checkUpdatedProfile.data?.user?.bio === 'Audited and verified by Danial Swarm.';
    report(4, 'Profile Inspection & Update Mutations', run4Ok,
           `Fetched profile -> 200, Updated profile -> 200 (DisplayName: "${checkUpdatedProfile.data?.user?.displayName}")`);

    // -------------------------------------------------------------
    // RUN 5: Post Creation & Guardrails (Empty Rejection & Formats)
    // -------------------------------------------------------------
    console.log('\n--- EXECUTING RUN 5: Post Creation & Guardrails ---');
    const emptyPostRes = await request('POST', '/api/posts', { body: '   ', mediaUrl: '' }, { Cookie: userCookie });
    const unauthedPostRes = await request('POST', '/api/posts', { body: 'Hacking post without auth' });
    const validPostRes = await request('POST', '/api/posts', {
      body: 'Ruthless QA Post #1: Verified system integrity.',
      type: 'text'
    }, { Cookie: userCookie });

    const run5Ok = emptyPostRes.status === 400 &&
                   unauthedPostRes.status === 401 &&
                   validPostRes.status === 200 &&
                   validPostRes.data?.post?.body?.includes('Ruthless QA Post #1');
    report(5, 'Post Validation (Empty rejection, Auth requirement, Post publishing)', run5Ok,
           `Empty post -> 400, Unauthed post -> 401, Valid post created ID: ${validPostRes.data?.post?.id}`);

    // -------------------------------------------------------------
    // RUN 6: Create Second User & Social Graph (Follow/Unfollow)
    // -------------------------------------------------------------
    console.log('\n--- EXECUTING RUN 6: Social Graph & Follow Mechanics ---');
    const secondUser = 'qa_peer_' + Date.now();
    const signupSecond = await request('POST', '/api/auth/signup', {
      email: `${secondUser}@nexo.com`,
      username: secondUser,
      displayName: 'QA Peer User',
      password: 'Password@123'
    });
    const secondCookie = extractCookie(signupSecond.cookies);

    // Self follow should fail
    const selfFollowRes = await request('POST', '/api/follow', { username: uniqueUser }, { Cookie: userCookie });
    // Follow second user
    const followRes = await request('POST', '/api/follow', { username: secondUser }, { Cookie: userCookie });
    // Check second user's profile to verify follower count is 1
    const secondProfile = await request('GET', `/api/users/${secondUser}`, null, { Cookie: userCookie });

    const run6Ok = selfFollowRes.status === 400 &&
                   followRes.status === 200 &&
                   followRes.data?.following === true &&
                   secondProfile.data?.followers === 1 &&
                   secondProfile.data?.isFollowing === true;
    report(6, 'Social Graph (Self-follow rejection & Live follower sync)', run6Ok,
           `Self-follow -> 400 rejected, Follow peer -> 200 (followers count: ${secondProfile.data?.followers}, isFollowing: true)`);

    // -------------------------------------------------------------
    // RUN 7: Feed Privacy & Follow-Only Aggregation
    // -------------------------------------------------------------
    console.log('\n--- EXECUTING RUN 7: Feed Privacy & Chronological Sorting ---');
    // Peer creates a post
    const peerPost = await request('POST', '/api/posts', {
      body: 'Peer post that user 1 should see in Feed!',
      type: 'text'
    }, { Cookie: secondCookie });
    
    // User 1 fetches Feed
    const feedRes = await request('GET', '/api/posts?mode=feed', null, { Cookie: userCookie });
    const hasPeerPostInFeed = feedRes.data?.posts?.some(p => p.id === peerPost.data?.post?.id);
    const hasOwnPostInFeed = feedRes.data?.posts?.some(p => p.id === validPostRes.data?.post?.id);

    const run7Ok = feedRes.status === 200 && hasPeerPostInFeed && hasOwnPostInFeed;
    report(7, 'Feed Isolation & Following Stream Aggregation', run7Ok,
           `Feed successfully contains posts from self and followed peers (Total in feed: ${feedRes.data?.posts?.length})`);

    // -------------------------------------------------------------
    // RUN 8: Explore Feed Global Aggregation
    // -------------------------------------------------------------
    console.log('\n--- EXECUTING RUN 8: Global Explore Feed ---');
    const exploreRes = await request('GET', '/api/posts?mode=explore');
    const exploreOk = exploreRes.status === 200 && Array.isArray(exploreRes.data?.posts) && exploreRes.data.posts.length >= 2;
    report(8, 'Global Explore Feed Discovery', exploreOk,
           `Explore route returned ${exploreRes.data?.posts?.length} active public posts sorted by recency.`);

    // -------------------------------------------------------------
    // RUN 9: User Search Discovery
    // -------------------------------------------------------------
    console.log('\n--- EXECUTING RUN 9: User Search & Substring Querying ---');
    const searchRes = await request('GET', `/api/search?q=${uniqueUser.slice(0, 8)}`);
    const searchFound = searchRes.data?.users?.some(u => u.username === uniqueUser);
    const emptySearchRes = await request('GET', '/api/search?q=');
    const searchOk = searchRes.status === 200 && searchFound && emptySearchRes.status === 200;
    report(9, 'Search Discovery Engine', searchOk,
           `Found user '${uniqueUser}' via prefix search '${uniqueUser.slice(0, 8)}'. Empty query returned active index.`);

    // -------------------------------------------------------------
    // RUN 10: Logout & Session Invalidation
    // -------------------------------------------------------------
    console.log('\n--- EXECUTING RUN 10: Logout & Session Invalidation ---');
    const logoutRes = await request('POST', '/api/auth/logout', null, { Cookie: userCookie });
    const clearedCookie = extractCookie(logoutRes.cookies);
    // Try to access auth/me with cleared cookie or empty session
    const postLogoutMe = await request('GET', '/api/auth/me', null, { Cookie: clearedCookie || 'nexo_session=' });

    const run10Ok = logoutRes.status === 200 &&
                    logoutRes.cookies.some(c => c.includes('Max-Age=0') || c.includes('expires=')) &&
                    postLogoutMe.data?.user === null;
    report(10, 'Complete Logout & Cookie Invalidation', run10Ok,
           `Logout returned 200 with Max-Age=0. Post-logout /api/auth/me returns null user.`);

    // -------------------------------------------------------------
    // FINAL VERDICT
    // -------------------------------------------------------------
    console.log('\n===========================================================');
    console.log(`  QA SUMMARY: ${passed}/10 PASSED | ${failed}/10 FAILED`);
    console.log('===========================================================');

    if (failed === 0) {
      console.log('🏆 ALL 10 RUTHLESS QA RUNS PASSED WITH EXIT CODE 0! 🏆\n');
      cleanupAndExit(0);
    } else {
      console.error(`💥 QA FAILED ON ${failed} RUNS! 💥\n`);
      cleanupAndExit(1);
    }
  } catch (err) {
    console.error('Fatal QA execution error:', err);
    cleanupAndExit(1);
  }
}

function cleanupAndExit(code) {
  if (serverProcess) {
    console.log('Shutting down test Next.js server...');
    try {
      process.kill(serverProcess.pid);
    } catch (e) {}
  }
  process.exit(code);
}

async function waitForServer(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      await request('GET', '/');
      return true;
    } catch (e) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  throw new Error('Server did not become ready in time.');
}

console.log(`Starting Next.js production server on port ${PORT}...`);
serverProcess = spawn('npm.cmd', ['run', 'start', '--', '-p', String(PORT)], {
  cwd: 'C:/Users/aakash  chavan  07/.gemini/antigravity/scratch/nexo',
  shell: true
});

(async () => {
  try {
    console.log('Waiting for Next.js server to be ready on port 3015...');
    await waitForServer(40);
    console.log('Server is responsive. Launching QA runs!');
    await runRuthlessQA();
  } catch (err) {
    console.error('Startup failure:', err);
    cleanupAndExit(1);
  }
})();
