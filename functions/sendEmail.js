// Cloud functions skeleton (Node.js style). Placeholders for background jobs.

export async function sendApprovalEmail(payload:any){
  // payload: {to, subject, html, demandId}
  console.log('sendApprovalEmail called', payload)
  // integrate with SMTP or third-party here
}
